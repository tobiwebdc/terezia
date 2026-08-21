(function () {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    let pendingPayload = null;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // honeypot: if the hidden field is filled, it's likely a bot submission, so we just show a success message without actually sending the form
        const formData = new FormData(form);
        if (formData.get('website')) {
            status.textContent = 'Zpráva odeslána, díky!';
            form.reset();
            return;
        }

        status.textContent = 'Ověřuji...';
        submitButton.disabled = true;

        pendingPayload = Object.fromEntries(formData.entries());
        delete pendingPayload['cf-turnstile-response'];

        // turnstile.execute() will trigger the onTurnstileSuccess callback when the user successfully completes the challenge
        turnstile.execute('#turnstile-widget');
    });

    async function sendForm(token) {
        status.textContent = 'Odesílám...';
        const payload = { ...pendingPayload, turnstileToken: token };

        try {
            const response = await fetch('https://contact-form-worker.tobi-webdc.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Request failed');

            status.textContent = 'Zpráva odeslána, díky!';
            form.reset();
        } catch {
            status.textContent = 'Něco se pokazilo, zkus to prosím znovu.';
        } finally {
            pendingPayload = null;
            submitButton.disabled = false;
            turnstile.reset('#turnstile-widget');
        }
    }

    window.onTurnstileSuccess = function (token) {
        sendForm(token);
    };

    window.onTurnstileExpired = function () {
        status.textContent = 'Ověření vypršelo, zkus to prosím znovu.';
        pendingPayload = null;
        submitButton.disabled = false;
    };

    window.onTurnstileError = function () {
        status.textContent = 'Ověření selhalo, zkus to prosím znovu.';
        pendingPayload = null;
        submitButton.disabled = false;
    };
})();
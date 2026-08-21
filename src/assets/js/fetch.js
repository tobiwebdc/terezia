(function () {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Odesílám...';

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        payload.turnstileToken = formData.get('cf-turnstile-response');

        try {
            const response = await fetch('https://contact-form-worker.tobi-webdc.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Request failed');

            status.textContent = 'Zpráva odeslána, díky!';
            form.reset();
            turnstile.reset();
        } catch {
            status.textContent = 'Něco se pokazilo, zkus to prosím znovu.';
        }
    });
})();
(function () {
    const currentLang = document.documentElement.lang || 'es';
    const basePath = window.location.pathname.includes('/JPHAJP/') ? '/JPHAJP/' : '/';
    const labels = {
        es: {
            formSuccess: 'Mensaje enviado correctamente. Gracias.',
            formGenericError: 'Ha ocurrido un error. Intentalo de nuevo.',
            formNetworkError: 'Ocurrio un error. Intentalo de nuevo.'
        },
        en: {
            formSuccess: 'Message sent successfully. Thank you.',
            formGenericError: 'Something went wrong. Please try again.',
            formNetworkError: 'A network error occurred. Please try again.'
        },
        de: {
            formSuccess: 'Nachricht erfolgreich gesendet. Vielen Dank.',
            formGenericError: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
            formNetworkError: 'Ein Netzwerkfehler ist aufgetreten. Bitte versuche es erneut.'
        }
    };

    window.JPHA_I18N = {
        lang: currentLang,
        basePath,
        t(key) {
            return (labels[currentLang] && labels[currentLang][key]) || labels.es[key] || key;
        },
        projectLang() {
            const params = new URLSearchParams(window.location.search);
            const queryLang = params.get('lang');
            if (['es', 'en', 'de'].includes(queryLang)) return queryLang;
            if (['en', 'de'].includes(currentLang)) return currentLang;
            return 'es';
        }
    };
}());

// script.js (Guhertoya Dawî ya Paqijkirî)
document.addEventListener('DOMContentLoaded', () => {

    // --- Beşê 1: Lojîka Mênyuyê ---
    const kebabMenuButton = document.getElementById('kebab-menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (kebabMenuButton && dropdownMenu) {
        // Fenkşena ji bo vekirin/girtina mênyuyê
        kebabMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('visible');
        });

        // Fenkşena ji bo girtina mênyuyê dema ku li derve tê klîkkirin
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = dropdownMenu.contains(event.target);
            const isClickOnButton = kebabMenuButton.contains(event.target);

            if (!isClickInsideMenu && !isClickOnButton) {
                dropdownMenu.classList.remove('visible');
            }
        });
    }

    // --- Beşê 2: Lojîka Pêşketî ya Light/Dark Mode ---
    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        const themeIcon = themeMenuItem.querySelector('i');
        const themeText = themeMenuItem.querySelector('span');
        const htmlElement = document.documentElement;

        const applyTheme = (theme) => {
            htmlElement.classList.remove('light-mode');
            if (theme === 'light') {
                htmlElement.classList.add('light-mode');
            }
        };

        const updateThemeUI = (theme) => {
            if (theme === 'light') {
                themeIcon.className = 'fas fa-moon';
                themeText.textContent = 'Theme: Light';
            } else if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Theme: Dark';
            } else { // Auto
                themeIcon.className = 'fas fa-adjust';
                themeText.textContent = 'Theme: Auto';
            }
        };

        const cycleTheme = () => {
            const currentTheme = localStorage.getItem('theme') || 'auto';
            let newTheme;

            if (currentTheme === 'auto') newTheme = 'dark';
            else if (currentTheme === 'dark') newTheme = 'light';
            else newTheme = 'auto';

            if (newTheme === 'auto') {
                localStorage.removeItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
            } else {
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            }
            updateThemeUI(newTheme);
        };

        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                applyTheme(savedTheme);
                updateThemeUI(savedTheme);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
                updateThemeUI('auto');
            }
        };

        initializeTheme();
        themeMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            cycleTheme();
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
                updateThemeUI('auto');
            }
        });
    }

    // --- Beşê 3: Anîmasyon û Loading Bar ---
    const preloader = document.getElementById('preloader');
    const profilePic = document.querySelector('.profile-pic');
    
    // Hemî hêmanên ku divê anîmasyon li ser wan bê kirin berhev dike
    const itemsToAnimate = document.querySelectorAll('.animated-item');

    const startAnimations = () => {
        // Anîmasyona Wêneya Profîlê
        if (profilePic) {
            setTimeout(() => {
                profilePic.style.opacity = '1';
                profilePic.style.transform = 'translateY(0)';
            }, 200); // Piştî 200ms
        }
        
        // Anîmasyona Hêmanên Din (Bi Rêz)
        if (itemsToAnimate.length > 0) {
            itemsToAnimate.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 400 + (100 * index)); // Bi derengmayîna 100ms di navbera her hêmanekê de
            });
        }
    };

    window.addEventListener('load', () => {
        // Piştî ku bar tije dibe (1.2s), preloaderê veşêre
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 1200); // Divê ev dem wekî dema anîmasyona loading-bar be (1.2s)

        startAnimations();
    });


    // --- Beşê 4: Fenkşenên Çalakiyan (Share, Copy, QR) ---
    const qrMenuItem = document.getElementById('qr-menu-item');
    const shareMenuItem = document.getElementById('share-menu-item');
    const copyMenuItem = document.getElementById('copy-menu-item');
    const toast = document.getElementById('toast-notification');
    let isToastVisible = false;

    const copyLinkAndShowToast = () => {
        if (isToastVisible) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            isToastVisible = true;
            if (toast) toast.classList.add('toast-visible');
            document.body.classList.add('body-shake');
            setTimeout(() => document.body.classList.remove('body-shake'), 300);
            setTimeout(() => {
                if (toast) toast.classList.remove('toast-visible');
                isToastVisible = false;
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy link.');
        });
    };

    const shareProfile = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Ahmed Electric | Links', text: 'Check out all my links!', url: window.location.href });
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Error sharing:', err);
            }
        } else {
            copyLinkAndShowToast();
        }
    };

    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrUrlText = document.querySelector('.qr-url');
    let qrCodeInstance = null;

    const showQrModal = () => {
        if (!qrCodeInstance) {
            qrCodeInstance = new QRCodeStyling({
                width: 250, height: 250, data: window.location.href,
                image: "/img/IMG_7496.PNG",
                dotsOptions: { color: "#000000", type: "rounded" },
                backgroundOptions: { color: "#ffffff" },
                imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.3 },
                cornersSquareOptions: { type: "extra-rounded" },
                cornersDotOptions: { type: "dot" }
            });
            qrCodeInstance.append(qrcodeContainer);
        }
        qrUrlText.textContent = window.location.href;
        qrModal.classList.add('visible');
    };

    if(qrMenuItem) qrMenuItem.addEventListener('click', (e) => { e.preventDefault(); showQrModal(); dropdownMenu.classList.remove('visible'); });
    if(shareMenuItem) shareMenuItem.addEventListener('click', (e) => { e.preventDefault(); shareProfile(); dropdownMenu.classList.remove('visible'); });
    if(copyMenuItem) copyMenuItem.addEventListener('click', (e) => { e.preventDefault(); copyLinkAndShowToast(); dropdownMenu.classList.remove('visible'); });

    const closeQrButton = document.getElementById('closeQrButton');
    const downloadQrButton = document.getElementById('downloadQrButton');
    const closeQrModal = () => { if (qrModal) qrModal.classList.remove('visible'); };
    if (closeQrButton) closeQrButton.addEventListener('click', closeQrModal);
    if (qrModal) qrModal.addEventListener('click', (event) => { if (event.target === qrModal) closeQrModal(); });
    if (downloadQrButton) {
        downloadQrButton.addEventListener('click', () => {
            if (qrCodeInstance) {
                qrCodeInstance.download({ name: "Ahmed-Electric-QR", extension: "png" });
            }
        });
    }

    // --- Beşê 5: Lojîka Fórma Peywendiyê ---
    const contactModal = document.getElementById('contactModal');
    const contactMenuItem = document.getElementById('contact-menu-item');
    const closeContactButton = document.getElementById('closeContactButton');
    const contactForm = document.getElementById('contact-form');
    
    if (contactMenuItem) {
        const openContactModal = () => contactModal.classList.add('visible');
        contactMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
            dropdownMenu.classList.remove('visible');
        });
    }
    if (closeContactButton) {
        const closeContactModal = () => contactModal.classList.remove('visible');
        closeContactButton.addEventListener('click', closeContactModal);
    }
    if (contactModal) contactModal.addEventListener('click', (event) => { if (event.target === contactModal) contactModal.classList.remove('visible'); });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formStatus = contactForm.querySelector('#form-status');
            const submitButton = contactForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            formStatus.textContent = '';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "Thanks! Your message has been sent.";
                    formStatus.style.color = '#28a745';
                    contactForm.reset();
                    setTimeout(() => {
                        contactModal.classList.remove('visible');
                        formStatus.textContent = '';
                    }, 4000);
                } else {
                    response.json().then(data => {
                        formStatus.textContent = data.errors ? data.errors.map(error => error.message).join(', ') : "Oops! There was a problem.";
                        formStatus.style.color = '#dc3545';
                    })
                }
            }).catch(error => {
                formStatus.textContent = "Oops! There was a network error.";
                formStatus.style.color = '#dc3545';
            }).finally(() => {
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            });
        });
    }

    // --- Beşê 6: Lojîka Fórma Subscribe ---
    const subscribeModal = document.getElementById('subscribeModal');
    const subscribeMenuItem = document.getElementById('subscribe-menu-item');
    const closeSubscribeButton = document.getElementById('closeSubscribeButton');
    const subscribeForm = document.getElementById('subscribe-form');

    if (subscribeMenuItem) {
        const openSubscribeModal = () => subscribeModal.classList.add('visible');
        subscribeMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openSubscribeModal();
            dropdownMenu.classList.remove('visible');
        });
    }
    if (closeSubscribeButton) {
        const closeSubscribeModal = () => subscribeModal.classList.remove('visible');
        closeSubscribeButton.addEventListener('click', closeSubscribeModal);
    }
    if (subscribeModal) subscribeModal.addEventListener('click', (event) => { if (event.target === subscribeModal) subscribeModal.classList.remove('visible'); });

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(subscribeForm);
            const formStatus = subscribeForm.querySelector('#subscribe-form-status');
            const submitButton = subscribeForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            formStatus.textContent = '';

            fetch(subscribeForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "Thanks for subscribing!";
                    formStatus.style.color = '#28a745';
                    subscribeForm.reset();
                    setTimeout(() => {
                        subscribeModal.classList.remove('visible');
                        formStatus.textContent = '';
                    }, 4000);
                } else {
                    response.json().then(data => {
                        formStatus.textContent = data.errors ? data.errors.map(error => error.message).join(', ') : "Oops! There was a problem.";
                        formStatus.style.color = '#dc3545';
                    })
                }
            }).catch(error => {
                formStatus.textContent = "Oops! There was a network error.";
                formStatus.style.color = '#dc3545';
            }).finally(() => {
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            });
        });
    }

    // --- Beşê 7: Lojîka FAQ (Eger di pêşerojê de bê zêdekirin) ---
    // const faqQuestions = document.querySelectorAll('.faq-question');
    // faqQuestions.forEach(question => {
    //     question.addEventListener('click', () => {
    //         const faqItem = question.closest('.faq-item');
    //         faqItem.classList.toggle('active');
    //     });
    // });

});

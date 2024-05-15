document.addEventListener("DOMContentLoaded", ()=> {
    if (document.querySelector('.faq-cust__item')) {
        const faqs = document.querySelectorAll('.faq-cust__item');
        console.log(faqs);
    
        faqs.forEach(faq => {
            const faqBody = faq.querySelector('.faq-cust__item-body').querySelector('div');
            const plus = faq.querySelector('.faq-cust__item-icon--open');
            const minus = faq.querySelector('.faq-cust__item-icon--close');
    
            faqBody.style.height = '0px';
            faqBody.style.transform = 'translateY(-100%)';
            faqBody.style.marginTop = '0px';
    
    
            faq.addEventListener('click', () => {
                if (faqBody.style.height == '0px') {
                    faqBody.style.height = faqBody.scrollHeight + "px";
                    faqBody.style.transform = null;
                    faqBody.style.marginTop = null;
                    plus.style.display = 'none';
                    minus.style.display = 'block';
                } else {
                    faqBody.style.height = '0px';
                    faqBody.style.marginTop = '0px';
                    faqBody.style.transform = 'translateY(-100%)';
                    plus.style.display = 'block';
                    minus.style.display = 'none';
                }
    
            })
        })
    }


    const modalToggles = document.querySelectorAll('[data-target]');
    let regmodal;
    
    if (modalToggles.length > 0) {
        for (const modalToggle of modalToggles) {
            modalToggle.addEventListener('click', (event) => {
                regmodal = document.querySelector(modalToggle.getAttribute('data-target'));
    
                if (regmodal) {
                    regmodal.style.display = "block";
                }
            });
        }
    }

    const closer = document.querySelector('#closer');
    closer.addEventListener('click', () => {
        registerModal.style.display = 'none';
        document.body.classList.remove("overflow-hidden-tablet");
        
    });
    
    
    window.addEventListener('click', (event) => {
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
            document.body.classList.remove("overflow-hidden-tablet");
        }
    });
    
    
    const passwordToggleButtons = document.querySelectorAll('.password-toggle');
    
    passwordToggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetField = document.getElementById(targetId);
            if (targetField.type === 'password') {
                targetField.type = 'text';
                button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M15.3424 7.84812C15.3212 7.79938 14.8012 6.64625 13.6399 5.485C12.5624 4.40875 10.7112 3.125 7.99991 3.125C5.28866 3.125 3.43741 4.40875 2.35991 5.485C1.19866 6.64625 0.678659 7.7975 0.657409 7.84812C0.636042 7.89613 0.625 7.94808 0.625 8.00062C0.625 8.05317 0.636042 8.10512 0.657409 8.15312C0.678659 8.20125 1.19866 9.35437 2.35991 10.5156C3.43741 11.5919 5.28866 12.875 7.99991 12.875C10.7112 12.875 12.5624 11.5919 13.6399 10.5156C14.8012 9.35437 15.3212 8.20312 15.3424 8.15312C15.3638 8.10512 15.3748 8.05317 15.3748 8.00062C15.3748 7.94808 15.3638 7.89613 15.3424 7.84812ZM7.99991 12.125C6.03866 12.125 4.32616 11.4113 2.90928 10.0044C2.31533 9.41409 1.81272 8.73854 1.41803 8C1.81261 7.26158 2.31523 6.58622 2.90928 5.99625C4.32616 4.58875 6.03866 3.875 7.99991 3.875C9.96116 3.875 11.6737 4.58875 13.0905 5.99625C13.6846 6.58622 14.1872 7.26158 14.5818 8C14.1837 8.76312 12.1874 12.125 7.99991 12.125ZM7.99991 5.125C7.43129 5.125 6.87544 5.29362 6.40264 5.60952C5.92985 5.92543 5.56136 6.37445 5.34376 6.89979C5.12615 7.42512 5.06922 8.00319 5.18015 8.56088C5.29108 9.11858 5.5649 9.63086 5.96698 10.0329C6.36905 10.435 6.88133 10.7088 7.43902 10.8198C7.99672 10.9307 8.57479 10.8738 9.10012 10.6562C9.62546 10.4386 10.0745 10.0701 10.3904 9.59726C10.7063 9.12447 10.8749 8.56862 10.8749 8C10.8739 7.23781 10.5707 6.50712 10.0317 5.96816C9.49279 5.42921 8.7621 5.12599 7.99991 5.125ZM7.99991 10.125C7.57962 10.125 7.16878 10.0004 6.81932 9.76687C6.46987 9.53338 6.1975 9.20149 6.03666 8.8132C5.87583 8.42491 5.83375 7.99764 5.91574 7.58543C5.99773 7.17322 6.20012 6.79458 6.49731 6.4974C6.79449 6.20021 7.17313 5.99782 7.58534 5.91583C7.99755 5.83384 8.42482 5.87592 8.81311 6.03676C9.2014 6.19759 9.53328 6.46996 9.76678 6.81941C10.0003 7.16887 10.1249 7.57971 10.1249 8C10.1249 8.56359 9.90102 9.10409 9.50251 9.5026C9.104 9.90112 8.56349 10.125 7.99991 10.125Z" fill="black"/>
                </svg>
                `;
            } else {
                targetField.type = 'password';
                button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1213 11.2928C13.463 11.0353 13.7605 10.7697 14.0149 10.5156C15.1762 9.35437 15.6962 8.20312 15.7174 8.15312C15.7388 8.10512 15.7498 8.05317 15.7498 8.00062C15.7498 7.94808 15.7388 7.89613 15.7174 7.84812C15.6962 7.79938 15.1762 6.64625 14.0149 5.485C12.9374 4.40875 11.0862 3.125 8.37491 3.125C7.27297 3.125 6.31309 3.33706 5.48949 3.66106L6.06933 4.2409C6.79296 3.99744 7.5626 3.875 8.37491 3.875C10.3362 3.875 12.0487 4.58875 13.4655 5.99625C14.0596 6.58622 14.5622 7.26158 14.9568 8C14.7284 8.43776 13.9742 9.73068 12.582 10.7536L13.1213 11.2928ZM11.0003 9.17183C11.1641 8.80473 11.2499 8.40561 11.2499 8C11.2489 7.23781 10.9457 6.50712 10.4067 5.96816C9.86779 5.42921 9.1371 5.12599 8.37491 5.125C7.9693 5.125 7.57019 5.2108 7.20308 5.37465L7.78651 5.95808C7.84368 5.94161 7.90167 5.9275 7.96034 5.91583C8.37255 5.83384 8.79982 5.87592 9.18811 6.03676C9.5764 6.19759 9.90828 6.46996 10.1418 6.81941C10.3753 7.16887 10.4999 7.57971 10.4999 8C10.4999 8.20086 10.4715 8.39878 10.4168 8.58839L11.0003 9.17183ZM9.02358 10.0236L9.60066 10.6007C9.55933 10.6201 9.51747 10.6387 9.47512 10.6562C8.94979 10.8738 8.37172 10.9307 7.81402 10.8198C7.25633 10.7088 6.74405 10.435 6.34198 10.0329C5.9399 9.63086 5.66608 9.11858 5.55515 8.56088C5.44422 8.00319 5.50115 7.42512 5.71876 6.89979C5.7363 6.85745 5.75482 6.81561 5.77429 6.77429L6.35133 7.35133C6.32679 7.42789 6.30653 7.50604 6.29074 7.58543C6.20875 7.99764 6.25083 8.42491 6.41166 8.8132C6.5725 9.20149 6.84487 9.53338 7.19432 9.76687C7.54378 10.0004 7.95462 10.125 8.37491 10.125C8.59715 10.125 8.8158 10.0902 9.02358 10.0236ZM4.20742 5.20742C3.88717 5.44016 3.57932 5.70317 3.28428 5.99625C2.69023 6.58622 2.18761 7.26158 1.79303 8C2.18772 8.73854 2.69033 9.41409 3.28428 10.0044C4.70116 11.4113 6.41366 12.125 8.37491 12.125C9.25642 12.125 10.0408 11.976 10.7337 11.7337L11.3167 12.3167C10.4807 12.6532 9.50211 12.875 8.37491 12.875C5.66366 12.875 3.81241 11.5919 2.73491 10.5156C1.57366 9.35437 1.05366 8.20125 1.03241 8.15312C1.01104 8.10512 1 8.05317 1 8.00062C1 7.94808 1.01104 7.89613 1.03241 7.84812C1.05366 7.7975 1.57366 6.64625 2.73491 5.485C3.00045 5.21977 3.31299 4.94193 3.67381 4.67381L4.20742 5.20742Z" fill="black"/>
                <line x1="2.32025" y1="2.68386" x2="13.5607" y2="14.0704" stroke="black" stroke-width="0.9"/>
                </svg>
                `;
            }
        });
    });

});



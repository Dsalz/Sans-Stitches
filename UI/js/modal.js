const body = document.querySelector('body');

const showModal = (modalHeader, modalText, nextStep) => {
  const modalDiv = document.createElement('div');
  modalDiv.classList.add('modal');
  modalDiv.setAttribute('id', 'modal');
  modalDiv.innerHTML = `<div class="modal-backdrop" id="modalBackdrop">
       </div>
           <section class="actual-modal">
               <section class="modal-header">
               <h3 class="modal-header-text">${modalHeader}</h3>
               <span class="modal-header-close" id="closeModal">x<span>
               </span></span></section>
               <section class="modal-body">
                   <p class="modal-body-text">${modalText}</p>
               </section>
           </section>`;
  body.insertAdjacentElement('afterbegin', modalDiv);

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').remove();
    if (nextStep) {
      nextStep();
    }
  });

  document.getElementById('modalBackdrop').addEventListener('click', () => {
    document.getElementById('modal').remove();
    if (nextStep) {
      nextStep();
    }
  });
};

import Swal from 'sweetalert2';
import withReactContent, { ReactSweetAlertOptions } from 'sweetalert2-react-content';

import './sweet-alert.styles.css';

interface ISweetAlert extends ReactSweetAlertOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  removeUnused?: boolean;
}

export const SwalExtended = withReactContent(Swal);
export const SweetAlert = ({ size = 'md', removeUnused = true, ...options }: ISweetAlert) => {
  let swalOptions: ReactSweetAlertOptions = {
    buttonsStyling: false,
    showConfirmButton: false,
    showCloseButton: true,
    returnFocus: false,
    backdrop: true,
    customClass: {
      popup: `swal-size-${size} rounded-0 p-0`,
      htmlContainer: 'm-md-4 m-sm-3 mx-3 my-4',
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-secondary',
      actions: 'me-0',
      loader: 'sweet-loading-wrapper visually-hidden',
      closeButton: 'btn btn-light',
    },
  };

  if (options) {
    swalOptions = {
      ...swalOptions,
      ...options,
    };
  }

  if (removeUnused) {
    swalOptions = {
      ...swalOptions,
      willOpen: (popup: HTMLElement) => {
        popup.querySelectorAll<HTMLElement>("[class^='swal2-'],[class*='swal2-']").forEach(item => {
          if (item.classList.contains('swal2-actions') || item.classList.contains('btn')) {
            return;
          }

          if (item.style.display === 'none') {
            item.remove();
          }
        });
      },
    };
  }

  return SwalExtended.mixin(swalOptions);
};

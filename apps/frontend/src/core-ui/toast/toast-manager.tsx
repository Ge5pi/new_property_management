import { ToastContainer } from 'react-bootstrap';
import { Root, createRoot } from 'react-dom/client';

import { IToastProps } from 'interfaces/IToast';

import Toast from './toast-extended';

export class ToastManager {
  toasts: Array<IToastProps> = [];
  container: Root | null = null;

  constructor() {
    if (!document.getElementById('meganos-toast-container')) {
      const body = document.getElementsByTagName('body')[0];
      const wrapper = document.createElement('div');
      wrapper.id = 'meganos-toast-container';

      body.insertAdjacentElement('beforeend', wrapper);
    }

    const container = document.getElementById('meganos-toast-container');
    if (container) {
      this.container = createRoot(container);
    }
  }

  show(options: IToastProps) {
    const toastId = Math.random().toString(36).substring(2, 9);
    const id = options.id ?? toastId;
    const toast = {
      id: id,
      ...options, // if id is passed within options, it will overwrite the auto-generated one
      destroy: () => this.destroy(options.id ?? toastId),
    };

    this.toasts = [toast, ...this.toasts];
    this.render();
  }

  destroy(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.render();
  }

  render() {
    const toastsList = this.toasts.map(toastProps => <Toast key={toastProps.id} {...toastProps} />);

    this.container?.render(
      <ToastContainer position="bottom-start" className="p-3 toast-container-overlay">
        {toastsList}
      </ToastContainer>
    );
  }
}

export const Notify = new ToastManager();

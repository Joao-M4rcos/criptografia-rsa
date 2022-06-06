import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { JSEncrypt } from 'jsencrypt';
import { NotifierService } from 'angular-notifier';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @HostBinding('class') className = '';

  title = 'criptografia-rsa';

  key: any = new JSEncrypt();
  publicKey: string = '';
  privateKey: string = '';
  message: string = '';
  eMessage: string = '';
  private readonly notifier: NotifierService;
  keySizes: any = ['256', '512', '1024', '2048'];
  keySize: string = '1024';
  toggleControl = new FormControl(false);
  lightClassName: string = 'lightMode';
  darkClassName: string = 'darkMode';

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    const wi = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.className = this.lightClassName;

    if (wi) {
      this.toggleControl.setValue('true');
      this.className = this.darkClassName;
    }
  }

  generateKey = () => {
    if (!this.keySizes.includes(this.keySize)) this.keySize = '1024';

    this.key = new JSEncrypt({ default_key_size: this.keySize });
    this.publicKey = this.key.getPublicKey();
    this.privateKey = this.key.getPrivateKey();
    this.notifier.hideAll();
    this.notifier.show({
      type: 'success',
      message: 'Key successfully generated',
    });
  };

  encrypt = () => {
    if (!this.publicKey) this.generateKey();
    else this.key.setPublicKey(this.publicKey);

    let text = this.message;
    if (!this.key.encrypt(text))
      this.notifier.notify('error', 'Invalid public key');
    else {
      this.eMessage = this.key.encrypt(text);
      this.message = '';
    }
  };

  decrypt = () => {
    this.key.decrypt(this.eMessage);
    this.key.setPrivateKey(this.privateKey);

    if (!this.eMessage || !this.key.decrypt(this.eMessage))
      this.notifier.notify('error', 'Invalid private key or encrypted message');
    else {
      this.message = this.key.decrypt(this.eMessage);
      this.eMessage = '';
    }
  };

  clearFields = () => {
    this.publicKey = '';
    this.privateKey = '';
    this.message = '';
    this.eMessage = '';
    this.keySize = '1024';
  };

  changeThemeMode = () => {
    if (this.className == this.darkClassName)
      this.className = this.lightClassName;
    else {
      this.className = this.darkClassName;
    }
  };
}

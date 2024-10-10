import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-primary-button',
  templateUrl: './custom-primary-button.component.html',
  styleUrl: './custom-primary-button.component.scss'
})
export class CustomPrimaryButtonComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'submit' | 'button' | 'reset' = "submit";
  @Input() class: string = "";
}

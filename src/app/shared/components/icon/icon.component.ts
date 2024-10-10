import { Component, Input } from '@angular/core';

export type IconType = 
  'arrowRight' 
  | 'arrowLeft' 
  | 'card2' 
  | 'wallet'
  | 'caretArrowRight'
  | 'padlock'
  | 'userIconFilled'
  | 'camera'
  | 'visibilityOff'
  | 'call'
  | 'message'
  | 'profile'
  | 'shieldSecurity'
  | 'login'
  | 'close'
  | 'twitterVerifiedBadge'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input() iconType: IconType = 'arrowRight'
  @Input() iconHeight: string 
  @Input() iconFill: string
  @Input() iconStroke: string

  get importantIconHeight(): string {
    const height = '!' + this.iconHeight
    return height
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  contributors: {name: string, picURL: string, matNo?: string, desc?: string}[] = [
    { name: 'Abe Precious', matNo: '191019', picURL: 'assets/jpg/avatar.jpg' },
    { name: 'Adeleke Adesewa', matNo: '194143', picURL: 'assets/jpg/avatar.jpg' },
    { name: 'Adeyemo Shukurah', matNo: '196061', picURL: 'assets/jpg/avatar.jpg' },
    { name: 'Prof O.O Okediran', desc: 'Project Supervisor', picURL: 'assets/jpg/avatar.jpg' }
  ]

}

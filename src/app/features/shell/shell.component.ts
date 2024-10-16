import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';

import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  hasBackdrop = false
  mode: any = 'side'
  opened = true

  constructor(
    private utilityService: UtilityService,
  ) { }

  ngOnInit() {  }

  isMobile$ = this.utilityService.isMobile$.pipe(
    tap((res) => {
      this.hasBackdrop = res;
      this.mode = res ? 'over' : 'side';
      this.opened = !res
    })
  );
}

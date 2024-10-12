import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { CustomPrimaryButtonComponent } from './components/custom-primary-button/custom-primary-button.component';
import { IconComponent } from './components/icon/icon.component';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { OrdinalDateTimePipe } from './pipes/ordinal-date.pipe';


const declarations: any[] = [
  DateFormatterPipe,
  OrdinalDateTimePipe
]

const modules: any[] = [
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
];

const components = [
  CustomPrimaryButtonComponent,
  IconComponent,
  ScheduleComponent
]

@NgModule({
  declarations: [
    ...components,
    ...declarations,
  ],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...declarations,
    ...modules,
    ...components
  ]
})
export class SharedModule { }

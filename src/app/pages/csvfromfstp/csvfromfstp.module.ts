import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CsvfromfstpRoutingModule } from './csvfromfstp-routing.module';
import { CsvfromfstpComponent } from './csvfromfstp.component';
import { NzFormModule} from 'ng-zorro-antd/form'
import { NzInputModule} from 'ng-zorro-antd/input';
import { NzButtonModule} from 'ng-zorro-antd/button';
import { NzSelectModule} from 'ng-zorro-antd/select';
import { NzListModule} from 'ng-zorro-antd/list';


@NgModule({
  declarations: [
    CsvfromfstpComponent
  ],
  imports: [
    CommonModule,
    NzFormModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzListModule,
    ReactiveFormsModule,
    NzSelectModule,
    CsvfromfstpRoutingModule
  ]
})
export class CsvfromfstpModule { }

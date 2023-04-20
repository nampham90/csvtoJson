import { NgModule } from '@angular/core';
import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzUploadModule } from 'ng-zorro-antd/upload'
import { NzSpinModule} from 'ng-zorro-antd/spin'
import { NzButtonModule} from 'ng-zorro-antd/button';
import { NzTableModule} from 'ng-zorro-antd/table';
import { NzIconModule} from 'ng-zorro-antd/icon';
import { NzMessageModule} from 'ng-zorro-antd/message'
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [WelcomeRoutingModule,CommonModule,NzIconModule,NzTableModule,NzUploadModule,NzSpinModule,NzButtonModule,NzMessageModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }

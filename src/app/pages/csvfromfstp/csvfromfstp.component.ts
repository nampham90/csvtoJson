import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ServerfstpService } from 'src/service/serverfstp.service';
import { AccFstp } from 'src/model/accfstp'

@Component({
  selector: 'app-csvfromfstp',
  templateUrl: './csvfromfstp.component.html',
  styleUrls: ['./csvfromfstp.component.css']
})
export class CsvfromfstpComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  serverFstp!: AccFstp;
  isLoadingForm = false;
  isDownloadFile = false;
  isDownloadFilesql = false;
  message = "";
  messagedownload = "";
  messagedownloadsql = ''
  isShowAddressFile = false;
  isShowLogout = false;
  //mode
  addressfile = "";
  fileName = "";
  tableName  = "";
  addressfilecsv = "";
  listField = "";
  emailTo = '';
  //list
  tableNames: any[] = [];
  listFileLocal : any[] = [];
  msgDownloalFstp = '';

  constructor(
    private fb: UntypedFormBuilder,
    private serverFstpService : ServerfstpService
  ) { 
  
  }
  optionList = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ];

  selectedValue = { label: 'No', value: 0 };
  compareFn = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  log(value: { label: string; value: number }): void {
    console.log(this.selectedValue);
  }

  autoTips: Record<string, Record<string, string>> = {
    en: {
      required: 'Input is required'
    },
    default: {
      email: 'The input is not valid email'
    }
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoadingForm = true;
      this.serverFstp = {
        ip: this.validateForm.value.ip,
        port: this.validateForm.value.port,
        account: this.validateForm.value.account,
        password: this.validateForm.value.password
      }
      this.serverFstpService.loginFstp(this.serverFstp).subscribe(data => {
         console.log(data);
         this.isLoadingForm = false;
         if(data.code == 0) {
            this.isShowAddressFile = true;
            this.isShowLogout = true;
            this.message = "Connect Success !";
            let strJson = JSON.stringify(this.serverFstp)
            this.serverFstpService.setSessionStorage(strJson);
         }else {
          this.isShowAddressFile = false;
           this.message = "Connect Fail !"
         }
      },err => {
         console.log(err.message);
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      ip: ['', [Validators.required]],
      port: ['', [Validators.required]],
      account: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  downlowdFileZip() {
     if (this.addressfile == '' || this.fileName == '') {
        let listF = this.listField.split(',');
        console.log(listF);
        let lsttoString = listF.toString();
        console.log(lsttoString);
        this.messagedownload = "Vui lòng nhập thông tin !";
     } else {
       this.isDownloadFile = true;
       this.messagedownload = "";
       let data = {
          accFstp: this.serverFstpService.getAccountFstp(),
          addressFile: this.addressfile,
          fileName: this.fileName
       }
       this.serverFstpService.downloadFile(data).subscribe(data => {
          console.log(data);
          this.isDownloadFile = false;
          if(data.code == 0) {
            this.listFileLocal = data.listfile;
            this.msgDownloalFstp = data.msg;
          }else {
            this.msgDownloalFstp = data.msg;
          }
       })
     }
  }

  downlowdFileSql() {
    if (this.tableName == '' || this.addressfilecsv == '' || this.listField == '') {
      this.messagedownloadsql = "Vui lòng nhập thông tin !";
    } else {
      this.isDownloadFilesql = true
      let data = {
        headercsv: this.selectedValue.value,
        tableName: this.tableName,
        addressfilecsv: this.addressfilecsv,
        listField: this.listField,
        emailTo: this.emailTo
      }
      this.serverFstpService.downloadFileSql(data).subscribe(res => {
        console.log(res);
        this.isDownloadFilesql = false;
        if(res.code == 0){
          let strsql = res.sql;
          let file = new Blob([strsql], {
            type: 'application/sql',
          });
          //download file sql
          var a = document.createElement('a'),
          url = URL.createObjectURL(file);
          a.href = url;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        } else {
           this.messagedownloadsql = res.msg;
        }
      })
    }
  }

  DeleteFile() {

  }

  logoutServerFstp() {
    this.serverFstpService.clearSessionStorage();
    this.isShowAddressFile = false;
    this.listFileLocal = [];
    this.isShowLogout = false;
  }
}

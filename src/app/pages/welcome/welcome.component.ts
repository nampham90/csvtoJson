import { Component,VERSION, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Tsm180Service } from 'src/service/tsm180.service';

export class CsvData {
  public type: any;
  public zip: any;
  public basecd: any;
  public sortingcode: any;
  public prefcd: any;
  public municipalitycd: any;
  public townareacd: any;
  public citybloccd: any;
  public areaaddchargeflg: any;
  public seasonalchargeflg: any;
  public islandflg: any;
  public delivdistance: any;
  public deliverableflg: any;
  public impendatetime: any;
  public impusrcd: any;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  records: any[] = [];
  recordss: any[] = [];
  file: NzUploadFile | undefined
  isLoading = false;
  isUpload = true;
  jsondatadisplay: any;
  listReponse: any[] = [];
  strsql = '';
  constructor(
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private tsm180Service: Tsm180Service
  ) { }

    handleChange(info: NzUploadChangeParam): void {
    this.isLoading = true;
    this.records = [];
    if(info.type == 'removed'){
      this.records = [];
      this.isLoading = false;
      this.isUpload = true;
    }else{
      this.isUpload = false;
      this.file = info.file;
      console.log(this.file.name);
      let reader = new FileReader();
      reader.readAsText(this.file.originFileObj!);
      reader.onload = async () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
  
        let headersRow = this.getHeaderArray(csvRecordsArray);
  
        this.records =  this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        
        this.cdr.markForCheck();
        reader.onerror = function () {
          console.log('error is occured while reading file!');
        };
      };
    }
    
  }

  uploadServer() {
    this.isLoading = true;
    let totalreco = this.records.length;
    let uploadreco = 300;
    let vitritieptheo = 0;
    this.get1001Recordss(this.records,vitritieptheo);
  }

  get1001Recordss(reco: any, vitritieptheo: any) {
    let reco1001: any = [];
    let i = 0;
    for(let element of reco) {
       if(i >= (300+vitritieptheo)) { break;}
       if(vitritieptheo == 0) {
          element['index'] = i;
          reco1001.push(element);
       } else {
          if(i > vitritieptheo) {
            element['index'] = i;
            reco1001.push(element);
          }
       }
       i++;
    }
    this.tsm180Service.ListPosts(reco1001).subscribe(data =>{
      this.strsql += `${data.sql}\r`;
      if (data.code == 0){
        console.log(data.vitritieptheo + ", " + data.code + " success !")
      } else{
        console.log(data.vitritieptheo + ", " + data.code + " error !")
      }
      let mtr = {
        "vitritieptheo": data.vitritieptheo,
        "code": data.code
      }
      this.listReponse.push(mtr);
      if(data.vitritieptheo >= this.records.length-1){
        console.log("hoàn thanh")
        console.log(this.strsql);
        let file = new Blob([this.strsql], {
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

        alert("upload hoan thanh :" + data.vitritieptheo + " rows")
        this.isLoading = false
      }else {
        this.get1001Recordss(this.records,data.vitritieptheo);
      }
      
    },err =>{
      console.log(err.message);
    })
  }

  ngOnInit() {
    this.records = [...this.records];

    this.cdr.markForCheck();
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.type = curruntRecord[0].trim();
        csvRecord.zip = curruntRecord[1].trim();
        csvRecord.basecd = curruntRecord[2].trim();
        csvRecord.sortingcode = curruntRecord[3].trim();
        csvRecord.prefcd = curruntRecord[4].trim();
        csvRecord.municipalitycd = curruntRecord[5].trim();
        csvRecord.townareacd = curruntRecord[6].trim();
        csvRecord.citybloccd = curruntRecord[7].trim();
        csvRecord.areaaddchargeflg = curruntRecord[8].trim();
        csvRecord.seasonalchargeflg = curruntRecord[9].trim();
        csvRecord.islandflg = curruntRecord[10].trim();
        csvRecord.delivdistance = curruntRecord[11].trim();
        csvRecord.deliverableflg = curruntRecord[12].trim();
        csvArr.push(csvRecord);
      }
    }
    this.recordss = csvArr;
    this.isLoading = false;
    console.log({"Object":csvArr});
    return csvArr;
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    
    this.records = [];
    this.jsondatadisplay = '';
  }

  getJsonData() {
    this.jsondatadisplay = JSON.stringify(this.records);
  }

}

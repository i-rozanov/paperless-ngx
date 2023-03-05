import { AfterContentInit, AfterViewInit, Component, forwardRef, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
// import { throws } from 'assert'
// import { any } from 'cypress/types/bluebird'
import { FILTER_ADDED_AFTER, FILTER_ADDED_BEFORE, FILTER_ASN_ISNULL, FILTER_DOCUMENT_TYPE } from 'src/app/data/filter-rule-type'
import { PaperlessDocument } from 'src/app/data/paperless-document'
import { PaperlessDocumentType } from 'src/app/data/paperless-document-type'
import { DocumentService } from 'src/app/services/rest/document.service'
import { AbstractInputComponent } from '../abstract-input'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsnComponent),
      multi: true,
    },
  ],
  selector: 'app-input-asn',
  templateUrl: './asn.component.html',
  styleUrls: ['./asn.component.scss'],
})
export class AsnComponent extends AbstractInputComponent<string> {

  @Input()
  document: PaperlessDocument
  @Input()
  dTypes: PaperlessDocumentType[]

  prefix: string
  showPlusOne: boolean = false

  constructor(private documentService: DocumentService) {
    super()
  }

  zeroPad = (num, places) => String(num).padStart(places, '0')
  updateTextAsn(updatedValue){
    if (updatedValue){
      this.prefix = (this.dTypes.find(x => x.id === this.document.document_type) as PaperlessDocumentType)?.prefix
      this.value = updatedValue;
      this.showPlusOne = false;
    }
    else{
      this.showPlusOne = true;
    }
  }
  saveAsnToDocument(){
    console.log('saving: ' + this.document.archive_serial_number.toString())
    console.log(this.value)
    if (this.document.archive_serial_number > 1){
      console.log('gggg')
      this.value = this.zeroPad(this.document.archive_serial_number,5)
    }
    else {
      this.value = null;
      this.showPlusOne = true;
      this.document.archive_serial_number = null;
    }
  }

  nextAsn() {
    console.log('lllllllllllllllllllllll')
    // console.log(this.dTypes)
    // this.prefix = (this.dTypes.find(x => x.id === this.document.document_type) as PaperlessDocumentType).prefix + '-'
    // console.log(this.prefix)
    const [year] = this.document.added.toString().split('-');
    let shortYear : number = Number(year) - 2000
    console.log(year)
    console.log(shortYear)
    // console.log(this.value)
    // if (this.value) {
    //   return
    // }
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.document?.document_type.toString()}
        // { rule_type: FILTER_ADDED_AFTER, value: this.document}
        // { rule_type: FILTER_ASN_GT, value: this.document}
        // ДОБАВИТЬ ФИЛЬТР id != текущему
        // ДОБАВИТЬ ФИЛЬТР дата > начало года
      ])
      .subscribe((results) => {
        if (results.count > 0) {
          console.log(results.results[0].archive_serial_number)
          console.log((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear)
          this.value = String((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear) //TODO: ИСПРАВИТЬ СЛУЧАЙ С ПЕРЕХОДОМ ГОДА!
        } else {
          this.value = String(100 + shortYear)
        }
        this.onChange(this.value)
      })
  }
}

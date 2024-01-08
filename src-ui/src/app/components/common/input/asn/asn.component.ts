import { AfterContentInit, AfterViewInit, Component, forwardRef, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
// import { throws } from 'assert'
// import { any } from 'cypress/types/bluebird'
import { FILTER_ADDED_AFTER, FILTER_ADDED_BEFORE, FILTER_ASN_ISNULL, FILTER_CREATED_AFTER, FILTER_DOCUMENT_TYPE, FILTER_ID_NOT_EQUAL } from 'src/app/data/filter-rule-type'
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
  selector: 'pngx-input-asn',
  templateUrl: './asn.component.html',
  styleUrls: ['./asn.component.scss'],
})
export class AsnComponent extends AbstractInputComponent<string> {

  @Input()
  prefix: string
  @Input()
  init_value: string
  @Input()
  document: PaperlessDocument
  @Input()
  dTypes: PaperlessDocumentType[]
  @Input()
  showPlusOne: boolean = false

  constructor(private documentService: DocumentService) {
    super()
  }

  zeroPad = (num, places) => String(num).padStart(places, '0')

  nextAsn() {
    let year = new Date().getFullYear(); // this.document.added.toString().split('-');
    // const [year] = this.document.added.toString().split('-');
    let shortYear : number = Number(year) - 2000
    console.log(String(year)+"-01-01")
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.document?.document_type.toString()},
        { rule_type: FILTER_ID_NOT_EQUAL, value: this.document?.id.toFixed()},
        { rule_type: FILTER_ADDED_AFTER, value: String(year)+"-01-01"},
      ])
      .subscribe((results) => {
        console.log(results)
        if (results.count > 0) {
          // console.log(results.results[0].archive_serial_number)
          // console.log((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear)
          this.value = String((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear) //TODO: ИСПРАВИТЬ СЛУЧАЙ С ПЕРЕХОДОМ ГОДА!
        } else {
          this.value = String(100 + shortYear)
        }
        this.onChange(this.value)
      })
  }
}

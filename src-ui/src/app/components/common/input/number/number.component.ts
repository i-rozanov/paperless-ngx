import { Component, forwardRef, Input } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { FILTER_ASN_ISNULL, FILTER_CREATED_AFTER, FILTER_DOCUMENT_TYPE, FILTER_ID_NOT_EQUAL } from 'src/app/data/filter-rule-type'
import { PaperlessDocument } from 'src/app/data/paperless-document'
import { PaperlessDocumentType } from 'src/app/data/paperless-document-type'
import { DocumentService } from 'src/app/services/rest/document.service'
import { AbstractInputComponent } from '../abstract-input'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
  ],
  selector: 'app-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent extends AbstractInputComponent<number> {

  @Input()
  showAdd: boolean = true
  @Input()
  document: PaperlessDocument
  @Input()
  dTypes: PaperlessDocumentType[]
  @Input()
  prefix: string

  constructor(private documentService: DocumentService) {
    super()
  }

  nextAsn() {
    console.log(this.dTypes)
    this.prefix = (this.dTypes.find(x => x.id === this.document.document_type) as PaperlessDocumentType).prefix + '-'
    console.log(this.prefix)
    const [year] = this.document.added.toString().split('-');
    let shortYear : number = Number(year) - 2000
    if (this.value) {
      return
    }
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.document?.document_type.toString()},
        // { rule_type: FILTER_ID_NOT_EQUAL, value: this.document?.id.toFixed()},
        // { rule_type: FILTER_CREATED_AFTER, value: String(shortYear)+'-01-01'},
      ])
      .subscribe((results) => {
        if (results.count > 0) {
          console.log(results.results[0].archive_serial_number)
          console.log((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear)
          this.value = results.results[0].archive_serial_number + 1
        } else {
          this.value = 100 + shortYear
        }
        this.onChange(this.value)
      })
  }
}

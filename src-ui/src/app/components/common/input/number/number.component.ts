import { Component, forwardRef, Input } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { any } from 'cypress/types/bluebird'
import { FILTER_ASN_ISNULL, FILTER_DOCUMENT_TYPE } from 'src/app/data/filter-rule-type'
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

  constructor(private documentService: DocumentService) {
    super()
  }

  nextAsn() {
    console.log(this.dTypes)
    var prefix : string = (this.dTypes.find(x => x.id === this.document.document_type) as PaperlessDocumentType).prefix
    console.log(prefix)
    const [year, month, day] = this.document.created_date.toString().split('-');
    let shortYear : number = Number(year) - 2000
    if (this.value) {
      return
    }
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.document?.document_type.toString()}
      ])
      .subscribe((results) => {
        if (results.count > 0) {
          this.value = results.results[0].archive_serial_number + 1
        } else {
          this.value = 1
        }
        this.onChange(this.value)
      })
  }
}

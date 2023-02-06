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
      useExisting: forwardRef(() => AsnComponent),
      multi: true,
    },
  ],
  selector: 'app-input-asn',
  templateUrl: './asn.component.html',
  styleUrls: ['./asn.component.scss'],
})
export class AsnComponent extends AbstractInputComponent<number> {

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
    console.log(year)
    console.log(shortYear)

    if (this.value) {
      return
    }
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.document?.document_type.toString()}
        // ДОБАВИТЬ ФИЛЬТР id != текущему
        // ДОБАВИТЬ ФИЛЬТР дата > начало года
      ])
      .subscribe((results) => {
        if (results.count > 0) {
          console.log(results.results[0].archive_serial_number)
          console.log((Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear)
          this.value = (Math.floor(results.results[0].archive_serial_number/100)+1)*100+shortYear //TODO: ИСПРАВИТЬ СЛУЧАЙ С ПЕРЕХОДОМ ГОДА!
        } else {
          this.value = 100 + shortYear
        }
        this.onChange(this.value)
      })
  }
}

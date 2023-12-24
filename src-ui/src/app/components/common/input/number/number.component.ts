import { Component, forwardRef, Input } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { FILTER_ASN_ISNULL, FILTER_DOCUMENT_TYPE } from 'src/app/data/filter-rule-type'
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
  selector: 'pngx-input-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent extends AbstractInputComponent<number> {
  @Input()
  showAdd: boolean = true
  @Input()
  documentType: number

  @Input()
  step: number = 1

  @Input()
  step: number = 1

  constructor(private documentService: DocumentService) {
    super()
  }

  nextAsn() {
    if (this.value) {
      return
    }
    this.documentService
      .listFiltered(1, 1, 'archive_serial_number', true, [
        { rule_type: FILTER_ASN_ISNULL, value: 'false' },
        { rule_type: FILTER_DOCUMENT_TYPE, value: this.documentType.toString()}
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

  writeValue(newValue: any): void {
    if (this.step === 1) newValue = parseInt(newValue, 10)
    if (this.step === 0.01) newValue = parseFloat(newValue).toFixed(2)
    super.writeValue(newValue)
  }
}

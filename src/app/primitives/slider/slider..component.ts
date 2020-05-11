import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

let prescaler: number;
let position: number = 0;
let clientWidth: number;
let showValue: number;
let valueEmitter: EventEmitter<number> = new EventEmitter();

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})

export class SliderComponent implements OnInit {
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() index: string;
  @Input() unit: string;
  @Output() valueEmitter: EventEmitter<number> = new EventEmitter();

  public innerValue: number;
  @Input('value')
  get value(): number {
    return this.innerValue;
  }
  set value(value: number) {
    this.innerValue = value;
    position = Math.round((this.innerValue - this.minValue) / prescaler);
    this.position = position;
    showValue = this.innerValue;
  }

  public move: boolean = false;
  public position: number = 0;

  ngOnInit(): void {
    const el = document.getElementById("engine");
    el.addEventListener("touchstart", this.handleStart, false);
    el.addEventListener("touchend", this.handleEnd, false);
    el.addEventListener("touchmove", this.handleMove, false);

    const scale = document.getElementById("scale");
    clientWidth = scale.clientWidth;
    prescaler = (this.maxValue - this.minValue) / scale.clientWidth;
    valueEmitter.subscribe( val => this.valueEmitter.emit(Math.round(val)));
  }

  handleStart() {
    this.move = true;
  }

  handleEnd() {
    this.move = false;
    valueEmitter.emit(showValue);
  }

  handleMove(event) {
    if (this.move && (event.touches[0].clientX - 30 >= 0) && (event.touches[0].clientX - 30 <= clientWidth)) {
      position = event.touches[0].clientX - 30;
      this.position = event.touches[0].clientX - 30;
      const engine = document.getElementById("engine");
      engine.style.left = this.position + 'px';
      showValue = prescaler * this.position;
    }
  }

  getShowValue() {
    return Math.round(showValue);
  }
}

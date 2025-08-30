import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { UbButton } from '@/components/ui/button'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UbButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }

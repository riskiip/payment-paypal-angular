import { Component, AfterViewChecked } from "@angular/core";

declare let paypal: any;

@Component({
  selector: "app-root",

  templateUrl: "./app.component.html",

  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewChecked {
  addScript: boolean = false;

  paypalLoad: boolean = true;

  finalAmount: number = 1;

  paypalConfig = {
    env: "sandbox",

    client: {
      sandbox:
        "ATcMlsvLbJ6V0_MEUsxkQzun-9FpMFK7MUDJaZHbt_7YtqeS-XZBfPeGJkQha3UEPivhKqdQoeQ4LFV_",

      production: "<your-production-key-here>",
    },

    commit: true,

    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: "USD" } },
          ],
        },
      });
    },

    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
      });
    },
  };

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, "#paypal-checkout-btn");

        this.paypalLoad = false;
      });
    }
  }

  addPaypalScript() {
    this.addScript = true;

    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement("script");

      scripttagElement.src = "https://www.paypalobjects.com/api/checkout.js";

      scripttagElement.onload = resolve;

      document.body.appendChild(scripttagElement);
    });
  }
}

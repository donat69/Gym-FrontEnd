import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  providers: [ConfirmationService]
})
export class PosComponent implements OnInit {
  loading: boolean | undefined;
  @ViewChild('ticket', { static: false })
  ticket!: ElementRef;
  /* products: any[] = [
    { id: 1, name: 'Proteina 250mgs', price: 25.0, code: 1001 },
    { id: 2, name: 'Proteina 250grs', price: 43.0, code: 608875008451 },
    { id: 3, name: 'Otro Producto', price: 15.0, code: 724836500106 },
  ]; */

  // Props
  products: any[] = [];
  cart: any[] = [];
  totalItems: number = 0;
  orderTax: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;
  totalPayable: number = 0;
  searchQuery: string = '';
  showMatchingProductList: boolean = false;
  matchingProducts: any[] = [];
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | null = null;
  displayPaymentDialog: boolean = false;
  displayPurchaseReceipt: boolean = false;
  amountPaid: number | null = null;
  changeDue: number | null = null;
  isPaymentValid: boolean = false;
  reference: string | null = null;
  detailsSale: any = {};

  constructor(
    public auth: AuthService,
    private confirmationService: ConfirmationService,
    private api: ApiService,
    private crud: CrudService,
    public fun: FunctionsService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    //this.updateSummary();
  }

  fetchProducts() {
    this.api.getWithTenantID('crud/products', this.auth.user.tenantId).subscribe((data: any) => {
      this.products = Object.keys(data).map(key => data[key]);
    });
  }

  /**
   * Converts a number to its equivalent words in Spanish.
   * @param number - The number to convert.
   * @returns The equivalent words in Spanish.
   */
  /* numberToWords(number: number): string {
    const units = [
      '',
      'Uno',
      'Dos',
      'Tres',
      'Cuatro',
      'Cinco',
      'Seis',
      'Siete',
      'Ocho',
      'Nueve',
    ];
    const teens = [
      'Diez',
      'Once',
      'Doce',
      'Trece',
      'Catorce',
      'Quince',
      'Dieciséis',
      'Diecisiete',
      'Dieciocho',
      'Diecinueve',
    ];
    const tens = [
      '',
      '',
      'Veinte',
      'Treinta',
      'Cuarenta',
      'Cincuenta',
      'Sesenta',
      'Setenta',
      'Ochenta',
      'Noventa',
    ];

    if (number === 0) return 'Cero';

    let words = '';

    if (number >= 1000) {
      words += this.numberToWords(Math.floor(number / 1000)) + ' Mil ';
      number %= 1000;
    }

    if (number >= 100) {
      words += units[Math.floor(number / 100)] + ' Cientos ';
      number %= 100;
    }

    if (number >= 10 && number <= 19) {
      words += teens[number - 10] + ' ';
    } else if (number >= 20) {
      words += tens[Math.floor(number / 10)] + ' ';
      number %= 10;
    }

    if (number > 0) {
      words += units[number] + ' ';
    }

    return words.trim();
  } */

  /**
   * Handles the change event of the payment method dropdown.
   * If the payment method is "CASH", it ensures that the entered amount is valid.
   * Otherwise, it sets the payment as valid.
   */
  onPaymentMethodChange() {
    if (this.paymentMethod === 'CASH') {
      // Si la forma de pago es efectivo, asegúrate de que la cantidad ingresada sea válida
      this.isPaymentValid = this.amountPaid !== null && this.amountPaid >= this.totalPayable;
    } else {
      // Para otras formas de pago, no es necesario verificar la cantidad
      this.isPaymentValid = true;
    }
  }

  /**
   * Calculates the change due based on the payment method and amount paid.
   * If payment method is 'CASH' and amount paid is not null, calculates the change due and sets isPaymentValid accordingly.
   * If payment method is not 'CASH' or amount paid is null, sets changeDue to null and isPaymentValid to true.
   */
  calculateChange() {
    if (this.paymentMethod === 'CASH' && this.amountPaid !== null) {
      this.changeDue = this.amountPaid - this.totalPayable;
      if (this.changeDue < 0) {
        // La cantidad pagada es insuficiente
        this.isPaymentValid = false;
      } else {
        this.isPaymentValid = true;
      }
    } else if (this.amountPaid === null) {
      this.changeDue = null;
      this.isPaymentValid = false;
    } else {
      this.changeDue = null;
      this.isPaymentValid = true;
    }
  }

  openPaymentDialog() {
    this.paymentMethod = null;
    this.amountPaid = null;
    this.changeDue = null;
    this.reference = null;

    this.displayPaymentDialog = true;
  }

  closePaymentDialog() {
    this.paymentMethod = null;
    this.amountPaid = null;
    this.changeDue = null;
    this.reference = null;

    this.displayPaymentDialog = false;
  }

  selectPaymentMethod(method: 'CASH' | 'CARD' | 'TRANSFER') {
    this.paymentMethod = method;
  }

  continuePayment() {
    // Válida que se haya seleccionado un método de pago
    if (!this.paymentMethod) {
      return;
    }

    if (this.paymentMethod === 'CASH') {
      if (this.amountPaid === null || this.amountPaid < this.totalPayable) {
        return;
      }
    } else if (this.paymentMethod === 'CARD' || this.paymentMethod === 'TRANSFER') {
      if (!this.reference) {
        return;
      }
    }

    this.paymentMethod = null;
    this.amountPaid = null;
    this.changeDue = null;
    this.reference = null;

    this.displayPaymentDialog = false;
  }

  performSale() {
    this.loading = true;
    // Verifica que haya al menos un producto en el carrito y que la venta sea válida
    if (this.cart.length === 0 || !this.isPaymentValid) {
      console.log('No se puede realizar la venta. El carrito está vacío o la cantidad pagada no es válida.');
      return;
    }

    // Objeto que represente la venta
    const saleData = {
      products: this.cart,
      totalAmount: this.totalPayable,
      status: "PAID",
      saleDate: new Date(),
      paymentMethod: this.paymentMethod,
      reference: this.reference,
      tenantId: this.auth.user.tenantId
    };

    this.api.post('sales', saleData).subscribe((response) => {
      this.detailsSale = response;
      this.loading = false;
      this.displayPurchaseReceipt = true;

      this.fun.presentAlert('Venta realizada con éxito');
      this.resetSale();
    });
  }

  /**
   * Confirms the cancellation of a sale and resets the cart and values if accepted.
   */
  confirmCancel() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de cancelar la venta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resetSale(); // Limpia el carrito y restablece los valores
      },
    });
  }

  /**
   * Resets the sale by emptying the cart and updating the summary.
   */
  resetSale() {
    this.cart = [];
    this.paymentMethod = null;
    this.amountPaid = null;
    this.reference = null;
    this.totalPayable = 0;
    this.isPaymentValid = false;
    this.updateSummary();
    this.displayPaymentDialog = false;
  }

  /**
   * Displays a list of matching products.
   * @param matchingProducts An array of matching products to display.
   */
  showMatchingProducts(matchingProducts: any[]) {
    this.showMatchingProductList = true;
    this.matchingProducts = matchingProducts;
  }

  addProductFromSearch() {
    const query = this.searchQuery.trim().toLowerCase();

    // Oculta la lista de resultados si no hay caracteres en el input
    this.showMatchingProductList = query.length > 0;

    // Realiza una búsqueda que coincida en nombre o código si hay caracteres en el input
    // if (query.length > 0) {
    //   const matchingProducts = this.products.filter(
    //     (product) =>
    //       product.name.toLowerCase().includes(query) ||
    //       product.code.toString() === query
    //   );

    //   if (matchingProducts.length === 0) {
    //     console.log('No se encontraron productos que coincidan con la búsqueda.');
    //   } else if (matchingProducts.length === 1) {
    //     // Verifica si el producto ya está en el carrito
    //     const existingProduct = this.cart.find(
    //       (item) => item.id === matchingProducts[0].id
    //     );

    //     if (existingProduct) {
    //       // Si el producto ya está en el carrito, incrementa su cantidad en lugar de agregarlo nuevamente
    //       existingProduct.quantity += 1;
    //       existingProduct.subtotal = existingProduct.quantity * existingProduct.price;
    //     } else {
    //       // Si el producto no está en el carrito, agrégalo
    //       this.addToCart(matchingProducts[0]);
    //     }

    //     // Limpia el campo de búsqueda después de agregar el producto
    //     this.searchQuery = '';
    //   } else {
    //     // Hay varios productos que coinciden con la búsqueda, muestra la lista de resultados coincidentes
    //     this.showMatchingProducts(matchingProducts);
    //   }
    // }

    if (query.length > 0) {
      const firstCharIsNumber = !isNaN(+query[0]);

      let foundProduct = null;

      this.products.forEach((product) => {
        const productName = product.name.toLowerCase();
        const sku = product.sku.toString();

        // Si el primer carácter es un número, busca en SKU
        if (firstCharIsNumber && sku === query) {
          foundProduct = product;
          this.addToCart(foundProduct);

          this.searchQuery = '';
        }
        // Si el primer carácter es una letra, busca en nombre
        else if (!firstCharIsNumber && productName.includes(query)) {
          const matchingProducts = this.products.filter(
            (product) =>
              product.name.toLowerCase().includes(query)
          );
          // Si el nombre del producto contiene la cadena de búsqueda, agrégalo a la lista de coincidencias
          this.showMatchingProducts(matchingProducts);
        }
      });
    }
  }

  addToCart(product: any) {
    // const existingProduct = this.cart.find((item) => item.id === product.id);

    // if (existingProduct) {
    //   existingProduct.quantity += 1;
    //   existingProduct.subtotal =
    //     existingProduct.quantity * existingProduct.salePrice;
    // } else {
      const newCartItem = { ...product, quantity: 1, subtotal: product.salePrice };
      this.cart.push(newCartItem);
    // }

    this.updateSummary();

    // Oculta la lista de resultados coincidentes y limpia el campo de búsqueda cuando se agrega un producto.
    this.showMatchingProductList = false;
    this.searchQuery = '';
  }

  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1); // Elimina el producto del carrito
      this.updateSummary();
    }
  }

  updateSummary() {
    this.totalItems = this.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Calcular el totalAmount sumando los subtotales de todos los elementos en el carrito
    this.totalAmount = this.cart.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    // Actualiza el totalPayable
    this.totalPayable = this.totalAmount + this.orderTax - this.totalDiscount;
  }

  printTicket() {
    const content = this.ticket.nativeElement.innerHTML;
    const windowPrint = window.open('', '_blank');

    if (windowPrint) {
      windowPrint.document.write('<html><head><title>Payment Ticket</title></head><body>');
      windowPrint.document.write(content);
      windowPrint.document.write('</body></html>');
      windowPrint.document.close();
      windowPrint.print();
    } else {
      console.error('Error has occurred while printing the ticket.');
    }
  }
}

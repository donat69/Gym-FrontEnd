import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FunctionsService } from './functions.service';
import { catchError, tap, throwError } from 'rxjs';
import { InteractDatabaseProperties } from '../models/properties.model';

/**
 * Servicio para interactuar con la base de datos para obtener datos de la misma y asignarlos a propiedades.
 */
@Injectable({
  providedIn: 'root'
})
export class InteractDatabaseService {
  properties: InteractDatabaseProperties = {
    members: [],
    tenants: [],
    users: [],
    memberships: [],
    owners: [],
    gyms: [],
    typeLicences: [],
  };

  constructor(
    private api: ApiService,
    private fun: FunctionsService
  ) {}

  /**
   * Obtiene la propiedad de un elemento (miembro, inquilino, rol, usuario, membresía u propietario) de la base de datos.
   *
   * @param itemId El ID del elemento.
   * @param itemType El tipo de elemento ('member', 'tenant', 'role', 'user', 'membership' o 'owner').
   * @param property La propiedad a obtener ('name' o 'key').
   * @returns El valor de la propiedad del elemento, o 'N/A' si no se encuentra el elemento.
   */
  getItemProperty(itemId: number, itemType: 'member' | 'tenant' | 'role' | 'user' | 'membership' | 'owner' | 'gym' | 'typeLicence', property: 'name' | 'key' | 'address' | 'phone' | 'email'): string {
    let item: any;

    switch (itemType) {
      case 'member': {
        item = this.properties.members?.find((item: any) => item.id === itemId);
        break;
      }
      case 'tenant': {
        item = this.properties.tenants?.find((item: any) => item.id === itemId);
        break;
      }
      case 'user': {
        item = this.properties.users?.find((item: any) => item.id === itemId);
        break;
      }
      case 'membership': {
        item = this.properties.memberships?.find((item: any) => item.id === itemId);
        break;
      }
      case 'owner': {
        item = this.properties.owners?.find((item: any) => item.id === itemId);
        break;
      }
      case 'gym': {
        item = this.properties.gyms?.find((item: any) => item.id === itemId);
        break;
      }
      case 'typeLicence': {
        item = this.properties.typeLicences?.find((item: any) => item.id === itemId);
        break;
      }
      default:
        return 'N/A';
    }
    return item ? item[property] : 'N/A';
  }

  /**
   * Realiza una solicitud HTTP GET al servidor para obtener datos de una ruta específica
   * y asigna los datos obtenidos a la propiedad correspondiente en el objeto `properties`.
   * 
   * @param route La ruta para realizar la solicitud HTTP GET.
   * @param property La propiedad en `properties` a la cual se debe asignar la respuesta.
   */
  loadData(route: string, property: keyof InteractDatabaseProperties) {
    this.api.get(route).pipe(
      tap((response: any) => {
        this.properties[property] = response;
      }),
      catchError((error) => {
        this.fun.presentAlertError(
          error.error.message ||
          error.error.sqlMessage ||
          'Something went wrong. Try again.'
        );
        return throwError(error);
      })
    ).subscribe();
  }

  /**
   * Todos los métodos siguientes llaman al método `loadData` para obtener datos de la base de datos
   * y asignarlos a la propiedad correspondiente en el objeto `properties`.
   * 
   * @see loadData
   */
  loadMembers() {
    this.loadData('crud/members', 'members');
  }

  loadTenants() {
    this.loadData('crud/tenants', 'tenants');
  }

  loadUsers() {
    this.loadData('crud/users', 'users');
  }

  loadMemberships() {
    this.loadData('crud/memberships', 'memberships');
  }

  loadOwners() {
    this.loadData('crud/owners', 'owners');
  }

  loadGyms() {
    this.loadData('crud/gyms', 'gyms');
  }

  loadTypeLicences() {
    this.loadData('crud/typeLicences', 'typeLicences');
  }

}

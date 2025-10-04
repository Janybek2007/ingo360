export interface IItem {
  name: string;
  id: number;
}
export interface IReferenceItem extends IItem {
  indicator: string;
  country: IItem;
  region: IItem;
  settlement: IItem;
  district: IItem;
  promotion_type: IItem;
  product_group: IItem;
  brand: IItem;
  company: IItem;
  dosage_form: IItem;
  segment: IItem;
  position: IItem;
  responsible_employee: IItem;
  medical_facility: IItem;
  speciality: IItem;
  client_category: IItem;
  pharmacy_network: IItem;
  distributor: IItem;
}

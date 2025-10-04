geography
-country fields= [name]
-region fields= [name, country_id(select on countries)]
-district fields= [name, region_id(select on regions)]
-settlement fields= [name, district_id(select on districts)]

pharmacy
-product_group fields= [company_id(select on companies), name]
-promotion_type_id fields= [name]
-brands fields= [company_id(select on companies), name, promotion_type_id(select on promotion_types), group_id(select on groups)]
-form fields= [name]
-segment fields= [name]
-sku fields= [company_id(select on companies), name, brand_id(select on brands), promotion_type_id(select on promotion_types), group_id(select on groups), form_id(select on forms), dosage, segment_id(select on segments)]

employees
-position fields= [name]
-employee fields= [name, company_id(select on companies), position_id(select on positions), group_id(select on groups), region_id(select on regions), district_id(select on districts)]

customers
-distributor_network fields= [name]
-lpu fields= [name, settlement_id(select on settlements), district_id(select on districts), address]
-speciality fields= [name]
-client_category fields= [name]
-doctors fields= [name, employee_id(select on employees), speciality_id(select on specialities), lpu_id(select on lpus), client_category_id(select on client_categories)]
-pharmacy_client fields= [name, company_id(select on companies), employee_id(select on employees), distributor_network_id(select on distributor_networks), employee_id(select on employees), settlement_id(select on settlements), district_id(select on districts), lpu_id(select on lpus), client_category_id(select on client_categories)]

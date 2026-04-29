from src.import_fields import base
from src.import_fields import record_keys as keys
from src.import_fields.base import company
from src.utils.records_resolver import FieldResolverConfig as FC

period = FC(keys.PERIOD_KEY)
brand = FC(keys.BRAND_KEY)
segment = FC(keys.SEGMENT_KEY)
dosage = FC(keys.DOSAGE_KEY)
dosage_form = FC(keys.DOSAGE_FORM_KEY)
molecule = FC(keys.MOLECULE_KEY)

ims_fields = [
    company.as_required(),
    brand.as_required(),
    period.as_required(),
    segment,
    dosage,
    dosage_form,
    molecule,
    base.packages,
    base.amount,
]

import type { NeedModule } from "../config";
import { erpModule } from "./erp";
import { serviceModule } from "./service";

/** Registrerade produktmoduler: ERP (Sprint 2), Service & kunddialog (Sprint 4). */
export const MODULES: NeedModule[] = [erpModule, serviceModule];

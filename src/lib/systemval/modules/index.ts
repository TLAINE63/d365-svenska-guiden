import type { NeedModule } from "../config";
import { erpModule } from "./erp";
import { serviceModule } from "./service";
import { projectOperationsModule } from "./projectOperations";

/** Registrerade produktmoduler: ERP (Sprint 2), Service & kunddialog (Sprint 4), Project Operations (Sprint 5). */
export const MODULES: NeedModule[] = [erpModule, serviceModule, projectOperationsModule];

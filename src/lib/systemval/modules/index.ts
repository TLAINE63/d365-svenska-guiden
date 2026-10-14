import type { NeedModule } from "../config";
import { erpModule } from "./erp";

/** Registrerade produktmoduler. Sprint 2: endast ERP (BC kontra F&SCM). */
export const MODULES: NeedModule[] = [erpModule];

// Types de base correspondant aux modèles Prisma

/**
 * Interface Patient - Représente un patient dans le système
 */
export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  numeroSecu?: string | null;
  groupeSanguin?: string | null;
  allergie?: string | null;
  antecedents?: string | null;
  dateAdmission: string | null;
  dateSortie: string | null;
  statut: string | null;
}

/**
 * Interface Lit - Représente un lit dans un service
 */
export interface Lit {
  id: string;
  numeroLit: string;
  type: string | null;
  statut: string | null;
  serviceId: string;
  chambre: string | null;
  etage: string | null;
  patientId?: string;
}

/**
 * Interface Personnel - Représente un membre du personnel médical
 */
export interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance?: Date | null;
  email?: string | null;
  telephone?: string | null;
  profession: string;
  specialite?: string | null;
  matricule?: string | null;
  serviceId: string | null;
  dateEmbauche?: Date | null;
  statut?: string | null;
  etablissementId?: string | null;
}

/**
 * Interface Service - Représente un service hospitalier
 */
export interface Service {
  id: string;
  nom: string;
  description: string | null;
  etablissementId: string;
  etage: string | null;
  aile: string | null;
  capacite: number;
  statut: string | null;
  specialite: string | null;
  responsableId: string | null;
}

/**
 * Interface Etablissement - Représente un établissement de santé
 */
export interface Etablissement {
  id: string;
  nom: string;
  adresse: string;
  capacite: number;
  telephone?: string | null;
  email?: string | null;
  siteWeb?: string | null;
  codePostal?: string | null;
  ville?: string | null;
  pays: string;
  statut?: string | null;
  typology?: string | null;
}

/**
 * Interface Transfert - Représente un transfert de patient
 */
export interface Transfert {
  id: string;
  serviceDepartId: string;
  serviceArriveeId: string;
  patientId: string;
  motif?: string | null;
  date: string;
  statut?: string | null;
  autorisePar?: string | null;
  realiseePar?: string | null;
}

/**
 * Interface Reservation - Représente une réservation de lit
 */
export interface ReservationLit {
  id: string;
  litId: string;
  patientId: string;
  dateDepart: string;
  dateArrivee: string;
  etablissementDestinationId: string | null;
}

/**
 * Interface Materiel - Représente du matériel médical
 */
export interface Materiel {
  id: string;
  nom: string;
  description?: string | null;
  quantite: number;
  type?: string | null;
  marque?: string | null;
  modele?: string | null;
  numeroSerie?: string | null;
  dateAchat?: Date | null;
  dateMaintenance?: Date | null;
  statut?: string | null;
  serviceId?: string | null;
}

/**
 * Interface PriseEnCharge - Représente une prise en charge d'un patient par un personnel
 */
export interface PriseEnCharge {
  id: string;
  patientId: string;
  personnelId: string;
  dateDebut: string;
  dateFin?: string | null;
  description?: string | null;
  diagnostic?: string | null;
  traitement?: string | null;
  notes?: string | null;
}

// Types étendus avec relations

/**
 * Type étendu de Patient incluant ses relations
 */
export interface PatientWithRelations extends Patient {
  transferts?: Transfert[];
  reservations?: ReservationLit[];
  prisesEnCharge?: PriseEnCharge[];
  lit?: Lit;
}

/**
 * Type étendu de Lit incluant ses relations
 */
export interface LitWithRelations extends Lit {
  service?: Service;
  patient?: Patient;
  reservations?: ReservationLit[];
}

/**
 * Type étendu de Service incluant ses relations
 */
export interface ServiceWithRelations extends Service {
  personnel?: Personnel[];
  lits: Lit[];
  etablissement?: Etablissement;
  materiels?: Materiel[];
  transfertsDepart?: Transfert[];
  transfertsArrivee?: Transfert[];
  responsable?: Personnel;
  // Propriétés étendues concernant les lits
  litsDisponibles?: number;
  litsOccupes?: number;
  litsEnMaintenance?: number;
  tauxOccupation?: number;
  tauxDisponibilite?: number;
}

/**
 * Type étendu d'Etablissement incluant ses relations
 */
export interface EtablissementWithRelations extends Etablissement {
  services: Service[];
  personnels?: Personnel[];
  reservationsDestination?: ReservationLit[];
}

/**
 * Type étendu de Personnel incluant ses relations
 */
export interface PersonnelWithRelations extends Personnel {
  service?: Service;
  etablissement?: Etablissement;
  prisesEnCharge: PriseEnChargeWithPatient[];
  servicesResponsable?: Service[];
}

/**
 * Type étendu de Transfert incluant ses relations
 */
export interface TransfertWithRelations extends Transfert {
  patient?: Patient;
  serviceDepart?: Service;
  serviceArrivee?: Service;
  etablissementDepart?: Etablissement;
  etablissementArrivee?: Etablissement;
}

/**
 * Type étendu de PriseEnCharge incluant la relation avec Patient
 */
export interface PriseEnChargeWithPatient extends PriseEnCharge {
  patient?: Patient;
}

/**
 * Type étendu de PriseEnCharge incluant la relation avec Personnel
 */
export interface PriseEnChargeWithPersonnel extends PriseEnCharge {
  personnel?: Personnel;
}

/**
 * Type complet de PriseEnCharge incluant toutes ses relations
 */
export interface PriseEnChargeWithRelations extends PriseEnCharge {
  patient?: Patient;
  personnel?: PersonnelWithService;
}

/**
 * Type étendu de Personnel incluant uniquement la relation avec Service
 */
export interface PersonnelWithService extends Personnel {
  service?: Service;
}

/**
 * Type étendu de ReservationLit incluant ses relations
 */
export interface ReservationLitWithRelations extends ReservationLit {
  patient?: Patient;
  lit?: Lit;
  service?: Service; // Service associé au lit
  etablissementDestination?: Etablissement;
}

/**
 * Type étendu de Materiel incluant ses relations
 */
export interface MaterielWithRelations extends Materiel {
  service?: Service;
}

// Quelques utilitaires de type

/**
 * Type pour les champs de recherche d'entités
 */
export type EntitySearchFields<T> = { [K in keyof T]?: boolean };

/**
 * Type générique pour les résultats de pagination
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Type pour les options de tri
 */
export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

/**
 * Type pour le résultat des opérations d'API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

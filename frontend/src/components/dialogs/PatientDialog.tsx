import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useDialogStore } from "@/stores/dialog-store";

interface PatientDialogProps {
  onPatientCreated?: (newPatient: any) => void;
}

const PatientDialog: React.FC<PatientDialogProps> = ({ onPatientCreated }) => {
  const {
    showPatientDialog,
    setShowPatientDialog,
    patientForm,
    updatePatientField,
    submitPatientForm,
    activeFieldRef,
    setActiveFieldRef,
  } = useDialogStore();

  // Créer une référence pour le focus si elle n'existe pas déjà
  const localActiveFieldRef = useRef<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  >(null);

  // Initialiser la référence dans le store si nécessaire
  useEffect(() => {
    if (!activeFieldRef) {
      setActiveFieldRef(localActiveFieldRef);
    }
  }, [activeFieldRef, setActiveFieldRef]);

  // Référence à utiliser (celle du store ou la locale)
  const fieldRef = activeFieldRef || localActiveFieldRef;

  const handlePatientChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Sauvegarder la référence au champ actif
    fieldRef.current = e.target;

    // Traitement spécial pour les dates
    if (type === "date") {
      updatePatientField(
        name as keyof typeof patientForm,
        value ? new Date(value) : null
      );
    } else {
      updatePatientField(name as keyof typeof patientForm, value);
    }

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      await submitPatientForm(onPatientCreated);
    } catch (error) {
      console.error("Erreur lors de la création du patient:", error);
    }
  };

  return (
    <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau patient</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 py-4">
          {/* Première colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-nom" className="text-right">
                Nom
              </Label>
              <Input
                id="new-patient-nom"
                name="nom"
                value={patientForm.nom}
                onChange={handlePatientChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-prenom" className="text-right">
                Prénom
              </Label>
              <Input
                id="new-patient-prenom"
                name="prenom"
                value={patientForm.prenom}
                onChange={handlePatientChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-dateNaissance" className="text-right">
                Date de naissance
              </Label>
              <Input
                id="new-patient-dateNaissance"
                type="date"
                name="dateNaissance"
                value={
                  patientForm.dateNaissance instanceof Date
                    ? patientForm.dateNaissance.toISOString().split("T")[0]
                    : ""
                }
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-adresse" className="text-right">
                Adresse
              </Label>
              <Input
                id="new-patient-adresse"
                name="adresse"
                value={patientForm.adresse ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="new-patient-telephone"
                name="telephone"
                value={patientForm.telephone ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-patient-email" className="text-right">
                Email
              </Label>
              <Input
                id="new-patient-email"
                type="email"
                name="email"
                value={patientForm.email ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-numeroSecu" className="text-right">
                N° Sécurité sociale
              </Label>
              <Input
                id="patient-numeroSecu"
                name="numeroSecu"
                value={patientForm.numeroSecu ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-groupeSanguin" className="text-right">
                Groupe sanguin
              </Label>
              <Input
                id="patient-groupeSanguin"
                name="groupeSanguin"
                value={patientForm.groupeSanguin ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-allergie" className="text-right">
                Allergies
              </Label>
              <Textarea
                id="patient-allergie"
                name="allergie"
                value={patientForm.allergie ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-antecedents" className="text-right">
                Antécédents
              </Label>
              <Textarea
                id="patient-antecedents"
                name="antecedents"
                value={patientForm.antecedents ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-dateAdmission" className="text-right">
                Date d'admission
              </Label>
              <Input
                id="patient-dateAdmission"
                type="date"
                name="dateAdmission"
                value={
                  patientForm.dateAdmission instanceof Date
                    ? patientForm.dateAdmission.toISOString().split("T")[0]
                    : ""
                }
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-dateSortie" className="text-right">
                Date de sortie
              </Label>
              <Input
                id="patient-dateSortie"
                type="date"
                name="dateSortie"
                value={
                  patientForm.dateSortie instanceof Date
                    ? patientForm.dateSortie.toISOString().split("T")[0]
                    : ""
                }
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="patient-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={patientForm.statut ?? "Hospitalisé"}
                onValueChange={(value) => {
                  updatePatientField("statut", value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospitalisé">Hospitalisé</SelectItem>
                  <SelectItem value="Sortant">Sortant</SelectItem>
                  <SelectItem value="Ambulatoire">Ambulatoire</SelectItem>
                  <SelectItem value="Urgence">Urgence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPatientDialog(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer le patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;

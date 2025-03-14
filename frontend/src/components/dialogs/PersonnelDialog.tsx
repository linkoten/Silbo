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

import { useDialogStore } from "@/stores/dialog-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PersonnelDialogProps {
  onPersonnelCreated?: (newPersonnel: any) => void;
}

const PersonnelDialog: React.FC<PersonnelDialogProps> = ({
  onPersonnelCreated,
}) => {
  const {
    showPersonnelDialog,
    setShowPersonnelDialog,
    personnelForm,
    updatePersonnelField,
    submitPersonnelForm,
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

  const handlePersonnelChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Sauvegarder la référence au champ actif
    fieldRef.current = e.target;

    // Traitement spécial pour les dates
    if (type === "date") {
      updatePersonnelField(
        name as keyof typeof personnelForm,
        value ? new Date(value) : null
      );
    } else {
      updatePersonnelField(name as keyof typeof personnelForm, value);
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
      await submitPersonnelForm(onPersonnelCreated);
    } catch (error) {
      console.error("Erreur lors de la création du personnel:", error);
    }
  };

  return (
    <Dialog open={showPersonnelDialog} onOpenChange={setShowPersonnelDialog}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau personnel</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 py-4">
          {/* Première colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-nom" className="text-right">
                Nom
              </Label>
              <Input
                id="personnel-nom"
                name="nom"
                value={personnelForm.nom}
                onChange={handlePersonnelChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-prenom" className="text-right">
                Prénom
              </Label>
              <Input
                id="personnel-prenom"
                name="prenom"
                value={personnelForm.prenom}
                onChange={handlePersonnelChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-profession" className="text-right">
                Profession
              </Label>
              <Input
                id="personnel-profession"
                name="profession"
                value={personnelForm.profession}
                onChange={handlePersonnelChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-email" className="text-right">
                Email
              </Label>
              <Input
                id="personnel-email"
                type="email"
                name="email"
                value={personnelForm.email ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="personnel-telephone"
                name="telephone"
                value={personnelForm.telephone ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-dateNaissance" className="text-right">
                Date de naissance
              </Label>
              <Input
                id="personnel-dateNaissance"
                type="date"
                name="dateNaissance"
                value={
                  personnelForm.dateNaissance instanceof Date
                    ? personnelForm.dateNaissance.toISOString().split("T")[0]
                    : ""
                }
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-specialite" className="text-right">
                Spécialité
              </Label>
              <Input
                id="personnel-specialite"
                name="specialite"
                value={personnelForm.specialite ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-matricule" className="text-right">
                Matricule
              </Label>
              <Input
                id="personnel-matricule"
                name="matricule"
                value={personnelForm.matricule ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-serviceId" className="text-right">
                ID Service
              </Label>
              <Input
                id="personnel-serviceId"
                name="serviceId"
                value={personnelForm.serviceId ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
                placeholder="ID du service"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-dateEmbauche" className="text-right">
                Date d'embauche
              </Label>
              <Input
                id="personnel-dateEmbauche"
                type="date"
                name="dateEmbauche"
                value={
                  personnelForm.dateEmbauche instanceof Date
                    ? personnelForm.dateEmbauche.toISOString().split("T")[0]
                    : ""
                }
                onChange={handlePersonnelChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={personnelForm.statut ?? "Actif"}
                onValueChange={(value) => {
                  updatePersonnelField("statut", value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En congé">En congé</SelectItem>
                  <SelectItem value="En formation">En formation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="personnel-etablissementId" className="text-right">
                ID Établissement
              </Label>
              <Input
                id="personnel-etablissementId"
                name="etablissementId"
                value={personnelForm.etablissementId ?? ""}
                onChange={handlePersonnelChange}
                className="col-span-3"
                placeholder="ID de l'établissement"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPersonnelDialog(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer le personnel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonnelDialog;

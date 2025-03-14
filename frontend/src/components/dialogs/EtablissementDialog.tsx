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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDialogStore } from "@/stores/dialog-store";

interface EtablissementDialogProps {
  onEtablissementCreated?: (newEtablissement: any) => void;
}

const EtablissementDialog: React.FC<EtablissementDialogProps> = ({
  onEtablissementCreated,
}) => {
  const {
    showEtablissementDialog,
    setShowEtablissementDialog,
    etablissementForm,
    updateEtablissementField,
    submitEtablissementForm,
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

  const handleEtablissementChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Sauvegarder la référence au champ actif
    fieldRef.current = e.target;

    // Traitement spécial pour les valeurs numériques
    if (name === "capacite") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      updateEtablissementField(
        name as keyof typeof etablissementForm,
        numericValue
      );
    } else {
      updateEtablissementField(name as keyof typeof etablissementForm, value);
    }

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.focus();
      }
    }, 0);
  };

  const handleSelectChange = (value: string, field: string) => {
    updateEtablissementField(field as keyof typeof etablissementForm, value);
  };

  const handleSubmit = async () => {
    try {
      await submitEtablissementForm(onEtablissementCreated);
    } catch (error) {
      console.error("Erreur lors de la création de l'établissement:", error);
    }
  };

  return (
    <Dialog
      open={showEtablissementDialog}
      onOpenChange={setShowEtablissementDialog}
    >
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel établissement</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 py-4">
          {/* Première colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-nom" className="text-right">
                Nom de l'établissement
              </Label>
              <Input
                id="etablissement-nom"
                name="nom"
                value={etablissementForm.nom}
                onChange={handleEtablissementChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-adresse" className="text-right">
                Adresse
              </Label>
              <Input
                id="etablissement-adresse"
                name="adresse"
                value={etablissementForm.adresse}
                onChange={handleEtablissementChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-capacite" className="text-right">
                Capacité
              </Label>
              <Input
                id="etablissement-capacite"
                type="number"
                name="capacite"
                value={etablissementForm.capacite}
                onChange={handleEtablissementChange}
                className="col-span-3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="etablissement-telephone"
                name="telephone"
                value={etablissementForm.telephone ?? ""}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-email" className="text-right">
                Email
              </Label>
              <Input
                id="etablissement-email"
                type="email"
                name="email"
                value={etablissementForm.email ?? ""}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-codePostal" className="text-right">
                Code postal
              </Label>
              <Input
                id="etablissement-codePostal"
                name="codePostal"
                value={etablissementForm.codePostal ?? ""}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-ville" className="text-right">
                Ville
              </Label>
              <Input
                id="etablissement-ville"
                name="ville"
                value={etablissementForm.ville ?? ""}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-pays" className="text-right">
                Pays
              </Label>
              <Input
                id="etablissement-pays"
                name="pays"
                value={etablissementForm.pays ?? "France"}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-siteWeb" className="text-right">
                Site web
              </Label>
              <Input
                id="etablissement-siteWeb"
                name="siteWeb"
                value={etablissementForm.siteWeb ?? ""}
                onChange={handleEtablissementChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="etablissement-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={etablissementForm.statut ?? "Actif"}
                onValueChange={(value) => handleSelectChange(value, "statut")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowEtablissementDialog(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer l'établissement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EtablissementDialog;

import React, { useEffect, useRef, useState } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDialogStore } from "@/stores/dialog-store";
import EtablissementDialog from "./EtablissementDialog";
import { EtablissementFormValues } from "@/components/userFormSchema";

interface ServiceDialogProps {
  onServiceCreated?: (newService: any) => void;
}

const ServiceDialog: React.FC<ServiceDialogProps> = ({ onServiceCreated }) => {
  const {
    showServiceDialog,
    setShowServiceDialog,
    serviceForm,
    updateServiceField,
    submitServiceForm,
    activeFieldRef,
    setActiveFieldRef,
    setShowEtablissementDialog,
  } = useDialogStore();

  // État pour stocker la liste des établissements
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [loadingEtablissements, setLoadingEtablissements] =
    useState<boolean>(false);

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

  // Charger les établissements existants
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        setLoadingEtablissements(true);
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
      } finally {
        setLoadingEtablissements(false);
      }
    };

    if (showServiceDialog) {
      fetchEtablissements();
    }
  }, [showServiceDialog]);

  // Référence à utiliser (celle du store ou la locale)
  const fieldRef = activeFieldRef || localActiveFieldRef;

  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Sauvegarder la référence au champ actif
    fieldRef.current = e.target;

    // Mettre à jour le champ dans le store
    updateServiceField(name as keyof typeof serviceForm, value);

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (fieldRef.current) {
        fieldRef.current.focus();
      }
    }, 0);
  };

  const handleSelectChange = (value: string, field: string) => {
    updateServiceField(field as keyof typeof serviceForm, value);
  };

  const handleSubmit = async () => {
    try {
      await submitServiceForm(onServiceCreated);
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
    }
  };

  // Callback pour l'ajout d'un nouvel établissement
  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ) => {
    setEtablissements((prev) => [...prev, newEtablissement]);
    updateServiceField("etablissementId", newEtablissement.id as string);
  };

  return (
    <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau service</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 py-4">
          {/* Première colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-nom" className="text-right">
                Nom du service
              </Label>
              <Input
                id="new-service-nom"
                name="nom"
                value={serviceForm.nom}
                onChange={handleServiceChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="new-service-description"
                name="description"
                value={serviceForm.description ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-etablissement" className="text-right">
                Établissement
              </Label>
              <div className="col-span-3 flex items-center">
                <Select
                  value={serviceForm.etablissementId}
                  onValueChange={(value) =>
                    handleSelectChange(value, "etablissementId")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {etablissements.map((etablissement) => (
                      <SelectItem
                        key={etablissement.id}
                        value={etablissement.id as string}
                      >
                        {etablissement.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setShowEtablissementDialog(true)}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-etage" className="text-right">
                Étage
              </Label>
              <Input
                id="new-service-etage"
                name="etage"
                value={serviceForm.etage ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-aile" className="text-right">
                Aile
              </Label>
              <Input
                id="new-service-aile"
                name="aile"
                value={serviceForm.aile ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-capacite" className="text-right">
                Capacité
              </Label>
              <Input
                id="new-service-capacite"
                type="number"
                name="capacite"
                value={serviceForm.capacite}
                onChange={handleServiceChange}
                className="col-span-3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={serviceForm.statut ?? "Actif"}
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

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-specialite" className="text-right">
                Spécialité
              </Label>
              <Input
                id="new-service-specialite"
                name="specialite"
                value={serviceForm.specialite ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="new-service-responsable" className="text-right">
                Responsable
              </Label>
              <Input
                id="new-service-responsable"
                name="responsableId"
                value={serviceForm.responsableId ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
                placeholder="ID du responsable (optionnel)"
              />
            </div>
          </div>
        </div>

        {loadingEtablissements && (
          <div className="text-sm text-gray-500 text-center">
            Chargement des établissements...
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowServiceDialog(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Créer le service
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Intégration du Dialog d'établissement */}
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </Dialog>
  );
};

export default ServiceDialog;

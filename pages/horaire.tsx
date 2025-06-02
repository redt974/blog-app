import React from "react";

export default function Horaires() {
  const horaires = [
    {
      activité: "Basket",
      jours: "Mardi & Vendredi",
      horaires: "18h00 - 20h00",
      lieu: "",
    },
    {
      activité: "Tennis",
      jours: "Mercredi & Samedi",
      horaires: "14h00 - 17h00",
      lieu: "Terrain de Tennis Nord",
    },
    {
      activité: "Gym",
      jours: "Lundi & Jeudi",
      horaires: "09h00 - 10h30",
      lieu: "Salle Polyvalente",
    },
    {
      activité: "Boule Bretonne",
      jours: "Dimanche",
      horaires: "10h00 - 12h00",
      lieu: "Terrain Boulodrome",
    },
    {
      activité: "VTT",
      jours: "Samedi",
      horaires: "10h00 - 12h00",
      lieu: "Départ au Parc de Pierrelaye",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Horaires des Activités</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {horaires.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow-md p-6 rounded-lg bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{item.activité}</h2>
            <p><span className="font-medium">Jours :</span> {item.jours}</p>
            <p><span className="font-medium">Horaires :</span> {item.horaires}</p>
            <p><span className="font-medium">Lieu :</span> {item.lieu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import { darken } from "color2k";
import { useEffect, useState } from "react";

export const MappedinLigthYellow= "#bf4320";

// interface Images {
//   inner: {
//     ids?: string[];
//     embeddings?: number[];
//     metadatas?: {
//       x?: number;
//       y?: number;
//       floor?: number;
//     };
//     documents?: string[];
//     uris?: string[];
//     data?: any;
//     included?: string[];
//   };
// }

interface Person {
  metadata: {
    x: number;
    y: number;
    floor?: number;
  }
  id: string; //gcp url
}


function MyCustomComponent() {
  const { mapView, mapData } = useMap();
  const [people, setPeople] = useState<Person[]>([]);
  const [occupancy, setOccupancy] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Fetch people data from backend
    const fetchPeople = async () => {
      try {
        const response = await fetch('http://10.37.116.50:8000/get_all_images/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        console.log(response)
        const data = await response.json();
        console.log(data)
        let people: Person[] = data.ids.map((id: string, index: number) => ({
          id,
          metadata: data.metadatas[index],
        }));
        
        setPeople(people);
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchPeople();
  }, []);

  useEffect(() => {
    // Calculate occupancy based on people's locations
    console.log("people use effect", people)
    const newOccupancy: { [key: string]: number } = {};
    console.log('Array.isArray(people)', Array.isArray(people))
    mapData.getByType("space").forEach((space) => {
      const spaceOccupancy = Array.isArray(people) ? people.filter(person => {
        const metadata = person.metadata;
        return metadata.floor === parseInt(space.floor.name.replace("Floor ", ""))
      }).length : 0;
      console.log(space.name, spaceOccupancy)
      newOccupancy[space.name] = spaceOccupancy;
    });
    console.log(mapData.getByType("space"))
    setOccupancy(newOccupancy);
  }, [people, mapData]);

  useEffect(() => {
    // Update map view with occupancy data
    mapData.getByType("space").forEach((space) => {
      mapView.updateState(space, {
        color: occupancy[space.name] ? darken("red", occupancy[space.name] || 0) : "#FFFFFF",
      });
    });
  }, [occupancy, mapView, mapData]);

  return mapData.getByType("space").map((space) => {
    return (
      <Label key={space.id} target={space.center} text={space.name} />
    );
  });
}


export default function App() {
  // See Demo API key Terms and Conditions
  // https://developer.mappedin.com/v6/demo-keys-and-maps/
  const { isLoading, error, mapData } = useMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return mapData ? (
    <MapView mapData={mapData}>
      <MyCustomComponent />
    </MapView>
  ) : null;
}
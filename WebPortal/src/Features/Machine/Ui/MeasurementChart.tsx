import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ApiClient } from "../../../Util/ApiClient";
import { getUser } from "../../../Util/getUser";
import { BackendUrl } from "../../../Util/Urls";
import { useParams } from "react-router-dom";
import {Box as MantineBox, Checkbox, Flex, Title, Text, Select} from "@mantine/core"


interface MeasurementData {
  measurementTime: Date;
  value: number;
}

interface DataState {
  SpeedOfBelt: MeasurementData[];
  SpeedOfDrum: MeasurementData[];
  ThroughPut: MeasurementData[];
  SpeedOfVibration: MeasurementData[];
  SortingQuality: MeasurementData[];
}

interface ResponseData {
  type: keyof DataState;
  measurements: {
    type: string;
    value: number;
    measurementTime: string;
  }[];
}

const measurementTypes: Array<keyof DataState> = [
  "SpeedOfBelt",
  "SpeedOfDrum",
  "ThroughPut",
  "SpeedOfVibration",
  "SortingQuality",
];

interface MeasurementChartProps {
  data: DataState;
}

export const MeasurementChart: React.FC<MeasurementChartProps> = ({ data }) => {
  const [measurementData, setMeasurementData] = useState<DataState>({
    SpeedOfBelt: [],
    SpeedOfDrum: [],
    ThroughPut: [],
    SpeedOfVibration: [],
    SortingQuality: [],
  });

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiClient = new ApiClient();
        const user = getUser();
        const token = user?.access_token;

        const response = await apiClient.get(
          `${BackendUrl}/measurements/machine/${id}/latest`,
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const responseData = await response.json();
        const newMeasurementData: DataState = {
          SpeedOfBelt: [],
          SpeedOfDrum: [],
          ThroughPut: [],
          SpeedOfVibration: [],
          SortingQuality: [],
        };

        responseData.forEach((data: ResponseData) => {
          const measurementType = data.type;
          const measurements = data.measurements;

          if (newMeasurementData[measurementType]) {
            newMeasurementData[measurementType] = measurements.map((measurement) => ({
              measurementTime: new Date(measurement.measurementTime),
              value: measurement.value,
            }));
          }
        });

        setMeasurementData(newMeasurementData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const pruneOldMeasurements = (measurements: MeasurementData[]) => {
      const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
      return measurements.filter(
        (measurement) => measurement.measurementTime.getTime() > eightHoursAgo
      );
    };

    measurementTypes.forEach((type) => {
      if (data[type]?.length > 0) {
        const latestRealTimeValue = data[type][data[type].length - 1];

        setMeasurementData((prevData) => {
          const updatedData = { ...prevData };

          const prunedList = pruneOldMeasurements(prevData[type]);
          const lastRecordedValue = prunedList[prunedList.length - 1];

          if (!lastRecordedValue || lastRecordedValue.value !== latestRealTimeValue.value) {
            updatedData[type] = [
              ...prunedList,
              {
                measurementTime: new Date(latestRealTimeValue.measurementTime),
                value: latestRealTimeValue.value,
              },
            ];
          } else {
            updatedData[type] = prunedList; 
          }

          return updatedData;
        });
      }
    });
  }, [data]);

  const formatChartData = (measurements: MeasurementData[]) => {
    return measurements.map((measurement) => ({
      formattedTime: new Date(measurement.measurementTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: measurement.value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap="20px" mt="20px">
      {/* Erste Reihe mit drei Diagrammen */}
      <Flex justify="space-between" wrap="wrap" gap="20px">
        {measurementTypes.slice(0, 3).map((type) => {
          const chartData = formatChartData(measurementData[type]);

          return (
            <div
              key={type}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                flex: "500px",
                maxWidth: "500px", // Gleiche Breite für jedes Diagramm
              }}
            >
              <h3 style={{ textAlign: "center" }}>{type}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={chartData.length > 0 ? chartData : [{ formattedTime: "No Data", value: 0 }]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedTime" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="linear"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill={`url(#color${type})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </Flex>

      {/* Zweite Reihe mit zwei Diagrammen */}
      <Flex justify="space-between" wrap="wrap" gap="20px">
        {measurementTypes.slice(3).map((type) => {
          const chartData = formatChartData(measurementData[type]);

          return (
            <div
              key={type}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                flex: "1 1 calc(50% - 20px)",
                maxWidth: "calc(50% - 20px)", // Gleiche Breite für jedes Diagramm
              }}
            >
              <h3 style={{ textAlign: "center" }}>{type}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={chartData.length > 0 ? chartData : [{ formattedTime: "No Data", value: 0 }]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedTime" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="linear"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill={`url(#color${type})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
};


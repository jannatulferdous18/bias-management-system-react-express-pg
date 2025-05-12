import React from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
} from "mdb-react-ui-kit";
import "../styles/SearchBias.css";

export interface Bias {
  bias_id: number;
  bias_type: string;
  severity: string;
  type: string;
  domain: string;
  dataset_algorithm_version?: string;
}

interface BiasTableProps {
  biases: Bias[];
  onRowClick?: (biasId: number) => void;
}

const BiasTable: React.FC<BiasTableProps> = ({ biases, onRowClick }) => {
  return (
    <MDBTable
      align="middle"
      responsive
      bordered
      small
      hover
      className="styled-table"
    >
      <MDBTableHead>
        <tr className="table-header">
          <th>Bias ID</th>
          <th>Bias Type</th>
          <th>Severity</th>
          <th>Affected Component</th>
          <th>Domain</th>
        </tr>
      </MDBTableHead>

      <MDBTableBody>
        {biases.map((bias) => (
          <tr
            key={bias.bias_id}
            className="table-row"
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick?.(bias.bias_id)}
          >
            <td>{bias.bias_id ? `AIBID${bias.bias_id}` : "—"}</td>
            <td>{bias.bias_type}</td>
            <td>
              <MDBBadge
                color={
                  bias.severity === "High"
                    ? "danger"
                    : bias.severity === "Medium"
                    ? "warning"
                    : "success"
                }
                pill
              >
                {bias.severity}
              </MDBBadge>
            </td>
            <td>{bias.type}</td>
            <td>{bias.domain}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

export default BiasTable;

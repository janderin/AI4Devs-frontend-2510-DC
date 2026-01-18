import React, { useState, useEffect, useCallback } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import './SearchBar.css';

interface SearchBarProps {
  searchName: string;
  minScore: number | '';
  maxScore: number | '';
  onSearchNameChange: (value: string) => void;
  onMinScoreChange: (value: number | '') => void;
  onMaxScoreChange: (value: number | '') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchName,
  minScore,
  maxScore,
  onSearchNameChange,
  onMinScoreChange,
  onMaxScoreChange,
}) => {
  const [localSearchName, setLocalSearchName] = useState(searchName);

  // Debounce para búsqueda por nombre (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchNameChange(localSearchName);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchName, onSearchNameChange]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchName(e.target.value);
  }, []);

  const handleMinScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    onMinScoreChange(value);
  }, [onMinScoreChange]);

  const handleMaxScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    onMaxScoreChange(value);
  }, [onMaxScoreChange]);

  return (
    <div className="search-bar mb-4">
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Buscar por nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del candidato"
              value={localSearchName}
              onChange={handleNameChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Puntuación mínima</Form.Label>
            <Form.Control
              type="number"
              placeholder="Mínima"
              min="0"
              max="10"
              step="0.1"
              value={minScore}
              onChange={handleMinScoreChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Puntuación máxima</Form.Label>
            <Form.Control
              type="number"
              placeholder="Máxima"
              min="0"
              max="10"
              step="0.1"
              value={maxScore}
              onChange={handleMaxScoreChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../atoms/Input';
import { useDebounce } from '../../../hooks/useDebounce';

/**
 * @component SearchBar
 * @description Componente molecular de barra de búsqueda
 * @param {Object} props - Props del componente
 * @param {Function} props.onSearch - Función de búsqueda
 * @param {string} props.placeholder - Placeholder del input
 * @param {number} props.debounceMs - Delay del debounce
 * @returns {JSX.Element} Componente SearchBar
 */
export const SearchBar = ({
  onSearch,
  placeholder = 'Buscar...',
  debounceMs = 300,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
}; 
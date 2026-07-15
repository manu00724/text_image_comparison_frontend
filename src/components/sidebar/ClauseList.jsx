import { jsx as _jsx } from "react/jsx-runtime";
import { ClauseCard } from './ClauseCard';
export function ClauseList({ clauses, onSelect }) { return _jsx("div", { className: "space-y-3 p-3 pb-6", children: clauses.map((clause, index) => _jsx(ClauseCard, { clause: clause, onSelect: onSelect }, `${clause.onerous_name}-${index}`)) }); }

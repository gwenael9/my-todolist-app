import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectTasksProps {
  onChange: (value: string) => void;
}

export default function SelectTasks({ onChange }: SelectTasksProps) {
  const items = [
    { name: "En cours", path: "progress" },
    { name: "Terminée", path: "finish" },
  ];
  return (
    <Select onValueChange={onChange} defaultValue="all">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Progression" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Tout</SelectItem>
          {items.map((item, index) => (
            <SelectItem value={item.path} key={index}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

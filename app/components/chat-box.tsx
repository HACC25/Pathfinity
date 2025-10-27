import { ArrowUpIcon, Paperclip, Mic } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group"
import { Separator } from "./ui/separator"

export function ChatBox() {
  return (
    <div className="mb-5">
      <InputGroup>
        <InputGroupTextarea placeholder="Ask Pathfinity.." />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
          >
            <Paperclip />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost">Auto</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupButton
            variant="outline"
            className="rounded-full ml-auto"
            size="icon-xs"
          >
            <Mic />
          </InputGroupButton>
          <Separator orientation="vertical" className="!h-4" />
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            disabled
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

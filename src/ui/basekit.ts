/**
 * Façade UI Omed ↔ BaseKit.
 *
 * Tous les composants génériques de BaseKit sont réexportés ici sous des noms
 * propres (sans le suffixe `View`). Le reste de l'application importe depuis
 * `@/ui` (ce module) plutôt que directement depuis `@basekit/ui`, ce qui garde
 * la migration centralisée et réversible : si un composant doit être adapté,
 * enrobé ou remplacé, on ne touche qu'à ce fichier.
 *
 * Règle : ce module n'expose que des briques UI génériques. Aucune logique
 * biblique ne transite par ici.
 */

export {
  // Primitives
  ButtonView as Button,
  IconButtonView as IconButton,
  ButtonGroupView as ButtonGroup,
  BadgeView as Badge,
  TextView as Text,
  HeadingView as Heading,
  DividerView as Divider,
  KbdView as Kbd,
  AvatarView as Avatar,
  LinkView as Link,
  SpinnerView as Spinner,

  // Formulaires
  InputView as Input,
  TextInputView as TextInput,
  SearchInputView as SearchInput,
  PasswordInputView as PasswordInput,
  NumberInputView as NumberInput,
  TextareaView as Textarea,
  SelectView as Select,
  CheckboxView as Checkbox,
  SwitchView as Switch,
  RadioGroupView as RadioGroup,
  ToggleView as Toggle,
  ToggleGroupView as ToggleGroup,

  // Composition
  CardView as Card,
  CardHeaderView as CardHeader,
  CardContentView as CardContent,
  CardFooterView as CardFooter,
  CardTitleView as CardTitle,
  CardDescriptionView as CardDescription,
  ModalView as Modal,
  DrawerView as Drawer,
  TabsView as Tabs,
  AccordionView as Accordion,
  DropdownView as Dropdown,
  TooltipView as Tooltip,
  PopoverView as Popover,

  // Feedback
  AlertView as Alert,
  CalloutView as Callout,
  EmptyStateView as EmptyState,
  ErrorStateView as ErrorState,
  SkeletonView as Skeleton,
  ProgressView as Progress,

  // Mise en page
  StackView as Stack,
  InlineView as Inline,
  GridView as Grid,
  ContainerView as Container,
  SectionView as Section,
  ScrollAreaView as ScrollArea,
  PageHeaderView as PageHeader,

  // Icône utilitaire (un IconSlot accepte aussi n'importe quel ReactNode, donc
  // les icônes lucide-react existantes restent utilisables tel quel).
  Icon,
} from '@basekit/ui';

export type {
  ButtonProps,
  IconButtonProps,
  BadgeProps,
  TextProps,
  HeadingProps,
  InputProps,
  TextareaProps,
  SelectProps,
  SelectOption,
  CardProps,
  ModalProps,
  DrawerProps,
  TabsProps,
  TabItem,
  DropdownProps,
  DropdownItem,
  AlertProps,
  EmptyStateProps,
  ErrorStateProps,
  SkeletonProps,
  StackProps,
  InlineProps,
  GridProps,
  IconName,
  IconSlot,
} from '@basekit/ui';

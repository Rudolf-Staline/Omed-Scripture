/**
 * @basekit/ui — the component library.
 *
 * Every component is exported three ways so it works in any style:
 *  - `XView`     the React component (use in JSX)
 *  - `X`         the declarative factory (use in `UINode` trees)
 *  - `XProps`    the prop types
 *
 * Plus the renderer glue (`RenderNode`, `defaultRegistry`, `registerComponent`)
 * and ready-to-use layouts.
 */
// Renderer & registry
export { RenderNode, defaultRegistry, registerComponent, registerComponents, } from "./registry";
// Page builder (re-exported from core for one-import ergonomics)
export { Page, DashboardPage, AuthPage, SettingsPage, ReaderPage, FormPage, createPage, usePageRuntime, } from "@basekit/core";
export { Icon } from "./internal/Icon";
// Primitives
export { ButtonView, Button, IconButtonView, IconButton, ButtonGroupView, ButtonGroup, } from "./primitives/Button";
export { ToggleView, Toggle, ToggleGroupView, ToggleGroup, } from "./primitives/ToggleGroup";
export { InputView, Input, TextareaView, Textarea, FieldShell, } from "./primitives/Input";
export { TextInputView, TextInput, NumberInputView, NumberInput, PasswordInputView, PasswordInput, SearchInputView, SearchInput, EmailInputView, EmailInput, PhoneInputView, PhoneInput, UrlInputView, UrlInput, FileInputView, FileInput, DropzoneView, Dropzone, DateTimeInputView, DateTimeInput } from "./primitives/SpecializedInputs";
export { RadioView, Radio, RadioGroupView, RadioGroup, CheckboxGroupView, CheckboxGroup } from "./primitives/Selection";
export { CalendarView, Calendar, DatePickerView, DatePicker, TimePickerView, TimePicker } from "./primitives/Calendar";
export { MultiSelectView, MultiSelect, ComboboxView, Combobox, AutocompleteView, Autocomplete } from "./primitives/Choice";
export { SliderView, Slider, RangeSliderView, RangeSlider } from "./primitives/Slider";
export { DateInputView, DateInput } from "./primitives/DateInput";
export { SelectView, Select } from "./primitives/Select";
export { CheckboxView, Checkbox, SwitchView, Switch, } from "./primitives/Toggle";
export { TextView, Text, HeadingView, Heading } from "./primitives/Text";
export { BadgeView, Badge, LinkView, Link, AvatarView, Avatar, DividerView, Divider, KbdView, Kbd, SpinnerView, Spinner, } from "./primitives/Misc";
// Layout
export { StackView, Stack, InlineView, Inline, GridView, Grid, ContainerView, Container, SectionView, Section, ScrollAreaView, ScrollArea, SplitPaneView, SplitPane, } from "./layout/Primitives";
export { AppShellView, AppShell, SidebarView, Sidebar, TopbarView, Topbar, PageHeaderView, PageHeader, } from "./layout/Shell";
export { PageView, DashboardLayout, AuthLayout, ReaderLayout, SettingsLayout, FormLayout, } from "./layout/Layouts";
// Composition
export { Card, CardView, CardHeader, CardContent, CardFooter, CardHeaderView, CardContentView, CardFooterView, CardTitleView, CardDescriptionView, } from "./composition/Card";
export { ModalView, Modal, DrawerView, Drawer } from "./composition/Modal";
export { TabsView, Tabs, AccordionView, Accordion, DropdownView, Dropdown, } from "./composition/Disclosure";
export { TooltipView, Tooltip } from "./composition/Tooltip";
export { PopoverView, Popover } from "./composition/Popover";
// Navigation
export { PaginationView, Pagination } from "./navigation/Pagination";
export { BreadcrumbView, Breadcrumb } from "./navigation/Breadcrumb";
// Feedback
export { AlertView, Alert, CalloutView, Callout, EmptyStateView, EmptyState, ErrorStateView, ErrorState, } from "./feedback/Alert";
export { SkeletonView, Skeleton, ProgressView, Progress, } from "./feedback/Status";
export { ToastProvider, useToast } from "./feedback/Toast";
// Data
export { DataTableView, DataTable, Column } from "./data/DataTable";
export { TableView, Table, TableHeaderView, TableHeader, TableBodyView, TableBody, TableRowView, TableRow, TableHeadView, TableHead, TableCellView, TableCell, TableCaptionView, TableCaption, } from "./data/Table";
export { MetricCardView, MetricCard, StatBlockView, StatBlock, ListView, List, DescriptionListView, DescriptionList, TimelineView, Timeline, } from "./data/Display";
// Form
export { FormView, Form, FormSectionView, FormSection, FormFieldView, FormField, FormActionsView, FormActions, FilterBarView, FilterBar, FieldLabelView, FieldLabel, FieldHintView, FieldHint, FieldErrorView, FieldError, } from "./form/Form";
//# sourceMappingURL=index.js.map
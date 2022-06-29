export type ColumnItem = {
  character_octet_length: string | null
  comment: string
  compression_codec: string
  data_compressed_bytes: string
  data_uncompressed_bytes: string
  database: string
  datetime_precision: string | null
  default_expression: string
  default_kind: string
  is_in_partition_key: number
  is_in_primary_key: number
  is_in_sampling_key: number
  is_in_sorting_key: number
  marks_bytes: string
  name: string
  numeric_precision: string | null
  numeric_precision_radix: string | null
  numeric_scale: string | null
  position: string
  table: string
  type: string
}

export type TableItem = {
  database: string
  engine: string
  name: string
  size: string
}

export type DatabaseItem = {
  name: string
}
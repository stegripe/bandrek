export const dataTypes = [
	{
		name: "CHAR",
		canChangeLength: true,
		maxLength: 255
	},
	{
		name: "VARCHAR",
		canChangeLength: true,
		maxLength: 65535
	},
	{
		name: "TINYTEXT",
		canChangeLength: false,
		maxLength: 255
	},
	{
		name: "TEXT",
		canChangeLength: false,
		maxLength: 65535
	},
	{
		name: "BLOB",
		canChangeLength: false,
		maxLength: 65535
	},
	{
		name: "MEDIUMTEXT",
		canChangeLength: false,
		maxLength: 16777215
	},
	{
		name: "MEDIUMBLOB",
		canChangeLength: false,
		maxLength: 16777215
	},
	{
		name: "LONGTEXT",
		canChangeLength: false,
		maxLength: 4294967295
	},
	{
		name: "LONGBLOB",
		canChangeLength: false,
		maxLength: 4294967295
	},
	{
		name: "BIT",
		canChangeLength: true,
		maxLength: 64
	},
	{
		name: "TINYINT",
		canChangeLength: true,
		maxLength: 255
	},
	{
		name: "SMALLINT",
		canChangeLength: true,
		maxLength: 65535
	},
	{
		name: "MEDIUMINT",
		canChangeLength: true,
		maxLength: 16777215
	},
	{
		name: "INT",
		canChangeLength: true,
		maxLength: 4294967295
	},
	{
		name: "BIGINT",
		canChangeLength: true,
		maxLength: 18446744073709551615
	},
	{
		name: "FLOAT",
		canChangeLength: true,
		maxLength: 255
	},
	{
		name: "DOUBLE",
		canChangeLength: true,
		maxLength: 255
	},
	{
		name: "DECIMAL",
		canChangeLength: true,
		maxLength: 255
	},
	{
		name: "DATE",
		canChangeLength: false,
		maxLength: 0
	},
	{
		name: "TIME",
		canChangeLength: false,
		maxLength: 0
	},
	{
		name: "DATETIME",
		canChangeLength: false,
		maxLength: 0
	},
	{
		name: "TIMESTAMP",
		canChangeLength: false,
		maxLength: 0
	},
	{
		name: "YEAR",
		canChangeLength: false,
		maxLength: 0
	}
];

export const dataOptions: { [key: string]: string }[] = [
	{
		"Unsigned": "isUnsigned",
		"Auto Increment": "isAutoIncrement",
		"Primary Key": "isPrimaryKey",
		"Unique": "isUnique",
		"Not Null": "isNotNull",
		"Zerofill": "isZerofill"
	}
];

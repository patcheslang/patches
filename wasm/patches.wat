(module
	(func $__I64_ADD (param $lhs i64) (param $rhs i64) (result i64)
				local.get $lhs
				local.get $rhs
				i64.add)
	(export "__I64_ADD" (func $__I64_ADD))
	)
